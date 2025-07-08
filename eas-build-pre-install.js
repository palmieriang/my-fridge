const fs = require("fs");
const path = require("path");

function decodeBase64ToFile(encoded, filePath) {
  const buffer = Buffer.from(encoded, "base64");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

if (process.env.GOOGLE_SERVICES_JSON) {
  console.log("Restoring google-services.json from secret...");
  decodeBase64ToFile(
    process.env.GOOGLE_SERVICES_JSON,
    "./android/app/google-services.json",
  );
} else {
  console.warn(
    "GOOGLE_SERVICES_JSON environment variable not found. Skipping google-services.json restoration.",
  );
}

if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
  console.log("Restoring GoogleService-Info.plist from secret...");
  decodeBase64ToFile(
    process.env.GOOGLE_SERVICE_INFO_PLIST,
    "./ios/GoogleService-Info.plist",
  );
} else {
  console.warn(
    "GOOGLE_SERVICE_INFO_PLIST environment variable not found. Skipping GoogleService-Info.plist restoration.",
  );
}
