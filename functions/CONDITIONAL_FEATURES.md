# Firebase Functions - Environment-Based Features

This project uses environment-based feature flags for optimal developer experience and production safety.

## Architecture

### Development Environment
- **Auto-enabled features**: All features work automatically in development
- **No cost risk**: Firebase emulator is always free
- **Easy testing**: Test expensive features without configuration

### Production Environment  
- **Explicit control**: Features must be explicitly enabled
- **Cost safety**: No accidental expensive deployments
- **Granular control**: Enable features independently

## Current Implementation

### Always Active (Production Features)
- ✅ `onUserCreate` - User lifecycle management
- ✅ `onUserDelete` - Complete data cleanup

### Conditional Features (Optional)
- 📱 `checkExpiringProducts` - Daily notification check for expiring products
- ✅ `validateProductOnCreate` - Server-side product validation on creation
- ✅ `validateProductOnUpdate` - Server-side product validation on updates

## Environment Configuration

## Environment Configuration

### Development (Auto-enabled)
```bash
NODE_ENV=development
# All features automatically enabled for testing
```

### Production (Explicit Control)
```bash
NODE_ENV=production
PROD_ENABLE_NOTIFICATIONS=false      # Explicit control required
PROD_ENABLE_SERVER_VALIDATION=false  # Explicit control required
```

## How to Deploy Features

### Development Testing (Always Available)
```bash
# Features automatically work in development
firebase emulators:start
# Test notifications and validation without any setup
```

### Production Deployment
```bash
cd functions

# Create production environment file
cp .env.example .env.production

# Edit .env.production to enable desired features:
# NODE_ENV=production
# PROD_ENABLE_NOTIFICATIONS=true
# PROD_ENABLE_SERVER_VALIDATION=false

# Deploy
firebase deploy --only functions
```

### 2. For Notifications: Update User Schema
Add `notificationsEnabled: boolean` field to user documents:
```typescript
// In your client app
await updateDoc(doc(getUsersRef(), userId), {
  notificationsEnabled: true
});
```

### 3. For Validation: Update Client Handling
Handle server validation results:
```typescript
// In your client app - check for validation errors
const product = await getDoc(doc(getProductsRef(), productId));
if (product.data()?.validationErrors) {
  // Handle server validation errors
  Alert.alert("Validation Error", product.data().validationErrors.join(", "));
}
```

### 3. Deploy
```bash
firebase deploy --only functions
```

## Cost Management

### Current Costs (ENABLE_NOTIFICATIONS=false)
- User creation/deletion: ~$0.01/month for small apps
- No scheduled functions = No daily costs

### With Features Enabled
- Daily notifications: ~$0.40/month for every 1000 active users with notifications
- Server validation: ~$0.10/month for every 1000 products created
- Combined: Scales with actual usage, not user count

## Testing

### Emulator (Always Safe)
All functions run in emulator regardless of environment settings.

### Production Deployment
Only functions with `ENABLE_NOTIFICATIONS=true` will be deployed as scheduled functions.

## Future Features

You can add more conditional features using the same pattern:
```typescript
const ENABLE_FEATURE_X = process.env.ENABLE_FEATURE_X === "true";

export const myNewFeature = ENABLE_FEATURE_X ? onSchedule(...) : undefined;
export const myValidation = ENABLE_FEATURE_X ? onDocumentCreated(...) : undefined;
```

### Server Validation vs Client Validation

**Client-side (Current, Recommended):**
- ✅ **Free** - No server costs
- ✅ **Fast** - Immediate feedback
- ✅ **Good UX** - Real-time validation

**Server-side (Optional, When Enabled):**
- 🛡️ **Security** - Can't be bypassed
- ✅ **Data integrity** - Ensures valid data in database
- 📊 **Audit trail** - Logs all validation attempts
- 💰 **Cost** - Runs on every product creation/update
