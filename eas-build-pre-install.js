const fs = require("fs");
const path = require("path");

function decodeBase64ToFile(encoded, filePath) {
  const buffer = Buffer.from(encoded, "base64");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

function restore(encoded, targetPath, label) {
  if (encoded) {
    console.log(`Restoring ${label} from secret...`);
    decodeBase64ToFile(encoded, targetPath);
  } else if (!fs.existsSync(targetPath)) {
    console.warn(`${label} missing: no env var and no local file.`);
  }
}

restore(
  process.env.GOOGLE_SERVICES_JSON,
  "./android/app/google-services.json",
  "google-services.json",
);

restore(
  process.env.GOOGLE_SERVICE_INFO_PLIST,
  "./ios/GoogleService-Info.plist",
  "GoogleService-Info.plist",
);
