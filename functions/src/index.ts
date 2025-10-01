import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

// Environment configuration
// Check if running in Firebase emulator (most reliable for local development)
const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
const isDevelopment = process.env.NODE_ENV === "development" || isEmulator;

// Feature flags: auto-enabled in development, always enabled in production for now
const ENABLE_NOTIFICATIONS = true; // Enable notifications in both dev and production
const ENABLE_SERVER_VALIDATION = isDevelopment; // Only enable validation in development

// Set global options for Gen2
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();



// User creation function (Gen2) - triggers when user document is created
export const onUserCreate = onDocumentCreated(
  {
    document: "users/{userId}",
    region: "us-central1",
  },
  async (event) => {
    try {
      const userData = event.data?.data();
      const userId = event.params.userId;

      if (!userData) {
        console.warn("No user data found in document");
        return;
      }

      console.info(`Processing new user: ${userId}`);

      // Initialize default user settings
      const updates: Record<string, unknown> = {};

      // Set default notification preference (user can change in settings)
      if (userData.notificationsEnabled === undefined) {
        updates.notificationsEnabled = false; // Default to false, user opts in
      }

      // Additional user setup logic can go here
      // For example: initialize default settings, send welcome email, etc.

      // Update document with server timestamp if not already set
      if (!userData.createdAt) {
        updates.createdAt = FieldValue.serverTimestamp();
      }

      // Apply updates if there are any
      if (Object.keys(updates).length > 0) {
        await db.collection("users").doc(userId).update(updates);
      }
    } catch (error) {
      console.error("Error processing new user:", error);
    }
  },
);

// User deletion cleanup function (Gen2)
export const onUserDelete = onDocumentDeleted(
  {
    document: "users/{userId}",
    region: "us-central1",
  },
  async (event) => {
    try {
      const userId = event.params.userId;

      console.info(`Cleaning up data for user: ${userId}`);

      // Delete all products for this user
      const productsSnapshot = await db
        .collection("products")
        .where("authorID", "==", userId)
        .get();

      const batch = db.batch();
      productsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.info(
        `Deleted ${productsSnapshot.size} products for user ${userId}`,
      );

      // Delete profile image from Storage
      try {
        const bucket = storage.bucket();
        const profileImagePath = `profileImages/${userId}`;

        // Check if profile image exists and delete it
        const [exists] = await bucket.file(profileImagePath).exists();
        if (exists) {
          await bucket.file(profileImagePath).delete();
          console.info(`Deleted profile image for user ${userId}`);
        } else {
          console.info(`No profile image found for user ${userId}`);
        }
      } catch (storageError) {
        console.error(
          `Error deleting profile image for user ${userId}:`,
          storageError,
        );
        // Don't throw here - we want to continue with other cleanup
        // even if image deletion fails
      }
    } catch (error) {
      console.error("Error cleaning up user data:", error);
    }
  },
);

// ============================================================================
// CONDITIONAL FEATURES - Only enabled when ENABLE_NOTIFICATIONS=true
// ============================================================================

// Helper function to send expiring product notifications
async function sendExpiringProductNotifications(): Promise<{
  totalNotificationsSent: number;
  usersChecked: number;
  targetDate: string;
}> {
  // Calculate target date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Get all users who have enabled notifications
  const usersSnapshot = await db
    .collection("users")
    .where("notificationsEnabled", "==", true)
    .get();

  if (usersSnapshot.empty) {
    return {
      totalNotificationsSent: 0,
      usersChecked: 0,
      targetDate: tomorrowStr,
    };
  }

  let totalNotificationsSent = 0;

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    // Find products expiring tomorrow
    const expiringSnapshot = await db
      .collection("products")
      .where("authorID", "==", userId)
      .where("date", "==", tomorrowStr)
      .get();

    if (expiringSnapshot.size > 0) {
      const allProducts = expiringSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          date: data.date,
          place: data.place,
        };
      });

      const productNames = allProducts
        .map((product) => product.name)
        .slice(0, 3); // Limit to first 3 items

      // Get user's FCM token for push notifications
      const userDocRef = await db.collection("users").doc(userId).get();
      const userDataFresh = userDocRef.data();
      const fcmToken = userDataFresh?.fcmToken;

      if (fcmToken) {
        // Build notification message
        const notificationBody = `${expiringSnapshot.size} items: ${productNames.join(", ")}${expiringSnapshot.size > 3 ? "..." : ""}`;

        const message = {
          token: fcmToken,
          notification: {
            title: "🚨 Products Expiring Tomorrow!",
            body: notificationBody,
          },
          data: {
            type: "expiring_products",
            count: expiringSnapshot.size.toString(),
            products: JSON.stringify(productNames),
          },
          android: {
            notification: {
              icon: "ic_notification",
              color: "#FF6B35",
              channelId: "expiring_products",
            },
          },
          apns: {
            payload: {
              aps: {
                badge: expiringSnapshot.size,
                sound: "default",
              },
            },
          },
        };

        try {
          const response = await admin.messaging().send(message);
          console.info(`Notification sent to user ${userId}. Message ID: ${response}`);
          totalNotificationsSent++;
        } catch (fcmError: any) {
          console.error(`Failed to send notification to user ${userId}:`, fcmError.message);
        }
      } else {
        console.warn(`No FCM token for user ${userId}, skipping notification`);
      }
    }
  }

  const result = {
    totalNotificationsSent,
    usersChecked: usersSnapshot.size,
    targetDate: tomorrowStr,
  };

  console.info(`Expiring products check complete: ${totalNotificationsSent} notifications sent to ${usersSnapshot.size} users`);
  return result;
}

// Daily notification check - only runs when explicitly enabled
export const checkExpiringProducts = ENABLE_NOTIFICATIONS
  ? onSchedule(
      {
        schedule: "0 9 * * *", // Daily at 9:00 AM UTC
        region: "us-central1",
        memory: "256MiB",
      },
      async () => {
        console.info("Scheduled expiring products check triggered");

        try {
          const result = await sendExpiringProductNotifications();
          console.info("Scheduled check completed successfully:", result);
        } catch (error: any) {
          console.error("Error in scheduled expiring products check:", error.message);
          throw error;
        }
      },
    )
  : undefined;



// Test HTTP function to manually trigger expiring products check
export const testExpiringProducts = onRequest(
  {
    region: "us-central1",
  },
  async (req, res) => {
    console.info("Manual test endpoint triggered");

    try {
      const result = await sendExpiringProductNotifications();

      const response = {
        success: true,
        message: `Manual test complete. Sent ${result.totalNotificationsSent} notifications`,
        data: result,
        timestamp: new Date().toISOString(),
      };

      console.info("Manual test completed successfully:", response);
      res.status(200).json(response);
    } catch (error: any) {
      const errorResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      console.error("Error in manual test:", error.message);
      res.status(500).json(errorResponse);
    }
  },
);

// ============================================================================
// SERVER-SIDE VALIDATION - Only enabled when ENABLE_SERVER_VALIDATION=true
// ============================================================================

// Helper function to validate product data
function validateProductData(productData: any, productId: string): string[] {
  const errors: string[] = [];

  // Validate required fields
  if (!productData.name || typeof productData.name !== "string") {
    errors.push("Product name is required and must be a string");
  } else if (productData.name.trim().length === 0) {
    errors.push("Product name cannot be empty");
  } else if (productData.name.length > 100) {
    errors.push("Product name must be less than 100 characters");
  }

  if (!productData.date || typeof productData.date !== "string") {
    errors.push("Expiration date is required and must be a string");
  } else {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(productData.date)) {
      errors.push("Date must be in YYYY-MM-DD format");
    } else {
      const expirationDate = new Date(productData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(expirationDate.getTime())) {
        errors.push("Invalid date provided");
      } else if (expirationDate < today) {
        // Allow past dates but warn
        console.warn(
          `Product ${productId} has past expiration date: ` +
            `${productData.date}`,
        );
      }
    }
  }

  if (
    !productData.place ||
    !["fridge", "freezer"].includes(productData.place)
  ) {
    errors.push("Place must be either 'fridge' or 'freezer'");
  }

  if (!productData.authorID || typeof productData.authorID !== "string") {
    errors.push("Author ID is required");
  }

  return errors;
}

// Product validation on creation - only runs when explicitly enabled
export const validateProductOnCreate = ENABLE_SERVER_VALIDATION
  ? onDocumentCreated(
      {
        document: "products/{productId}",
        region: "us-central1",
      },
      async (event) => {
        try {
          const productData = event.data?.data();
          const productId = event.params.productId;

          if (!productData) {
            console.warn(`No product data found for product: ${productId}`);
            return;
          }

          console.info(`Validating new product: ${productId}`);

          const errors = validateProductData(productData, productId);

          // If validation fails, mark the product as invalid
          if (errors.length > 0) {
            console.error(
              `Product validation failed for ${productId}:`,
              errors,
            );

            // Add validation errors to the document
            await db.collection("products").doc(productId).update({
              validationErrors: errors,
              isValid: false,
              validatedAt: FieldValue.serverTimestamp(),
            });
          } else {
            // Mark as valid
            await db.collection("products").doc(productId).update({
              isValid: true,
              validatedAt: FieldValue.serverTimestamp(),
            });

            console.info(`Product ${productId} validated successfully`);
          }
        } catch (error) {
          console.error("Error in product validation:", error);
        }
      },
    )
  : undefined;

// Product validation on update - only runs when explicitly enabled
export const validateProductOnUpdate = ENABLE_SERVER_VALIDATION
  ? onDocumentUpdated(
      {
        document: "products/{productId}",
        region: "us-central1",
      },
      async (event) => {
        try {
          const productData = event.data?.after.data();
          const beforeData = event.data?.before.data();
          const productId = event.params.productId;

          if (!productData) {
            console.warn(`No product data found for product: ${productId}`);
            return;
          }

          // Prevent infinite loops - don't validate if this update was
          // triggered by validation
          if (productData.validatedAt && !beforeData?.validatedAt) {
            console.info(
              `Skipping validation for ${productId} - validation update`,
            );
            return;
          }

          // Only validate if actual product fields changed
          // (not validation metadata)
          const relevantFieldsChanged =
            productData.name !== beforeData?.name ||
            productData.date !== beforeData?.date ||
            productData.place !== beforeData?.place ||
            productData.authorID !== beforeData?.authorID;

          if (!relevantFieldsChanged) {
            console.info(
              `Skipping validation for ${productId} - no relevant fields changed`,
            );
            return;
          }

          console.info(`Validating updated product: ${productId}`);

          const errors = validateProductData(productData, productId);

          // If validation fails, mark the product as invalid
          if (errors.length > 0) {
            console.error(
              `Product validation failed for ${productId}:`,
              errors,
            );

            // Add validation errors to the document
            await db.collection("products").doc(productId).update({
              validationErrors: errors,
              isValid: false,
              validatedAt: FieldValue.serverTimestamp(),
            });
          } else {
            // Mark as valid
            await db.collection("products").doc(productId).update({
              isValid: true,
              validatedAt: FieldValue.serverTimestamp(),
            });

            console.info(`Product ${productId} validated successfully`);
          }
        } catch (error) {
          console.error("Error in product validation:", error);
        }
      },
    )
  : undefined;
