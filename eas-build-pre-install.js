const fs = require("fs");
const path = require("path");

function decodeBase64ToFile(encoded, filePath) {
  const buffer = Buffer.from(encoded, "base64");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

const androidConfigPath = "./android/app/google-services.json";
const iosConfigPath = "./ios/GoogleService-Info.plist";

if (process.env.GOOGLE_SERVICES_JSON) {
  console.log("Restoring google-services.json from secret...");
  decodeBase64ToFile(process.env.GOOGLE_SERVICES_JSON, androidConfigPath);
} else if (!fs.existsSync(androidConfigPath)) {
  console.warn(
    "GOOGLE_SERVICES_JSON environment variable not found and file doesn't exist locally.",
  );
}

if (process.env.GOOGLE_SERVICE_INFO_PLIST) {
  console.log("Restoring GoogleService-Info.plist from secret...");
  decodeBase64ToFile(process.env.GOOGLE_SERVICE_INFO_PLIST, iosConfigPath);
} else if (!fs.existsSync(iosConfigPath)) {
  console.warn(
    "GOOGLE_SERVICE_INFO_PLIST environment variable not found and file doesn't exist locally.",
  );
}
