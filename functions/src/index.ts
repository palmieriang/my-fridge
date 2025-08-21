import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import {FieldValue} from "firebase-admin/firestore";

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

      // Additional user setup logic can go here
      // For example: initialize default settings, send welcome email, etc.

      // Update document with server timestamp if not already set
      if (!userData.createdAt) {
        await db
          .collection("users")
          .doc(userId)
          .update({
            createdAt: FieldValue.serverTimestamp(),
          });
      }
    } catch (error) {
      console.error("Error processing new user:", error);
    }
  }
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
        `Deleted ${productsSnapshot.size} products for user ${userId}`
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
          storageError
        );
        // Don't throw here - we want to continue with other cleanup
        // even if image deletion fails
      }
    } catch (error) {
      console.error("Error cleaning up user data:", error);
    }
  }
);
