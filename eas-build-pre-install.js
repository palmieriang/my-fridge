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
}
