// scripts/write-google-services.js
// Writes the EAS file secret content (provided as env var) to google-services.json
// This file will be run as a build hook during EAS build so the native android
// build can pick up the file referenced in app.json.

const fs = require('fs');
const path = require('path');

const OUT = path.resolve(process.cwd(), 'google-services.json');
const ENV_NAME = 'ANDROID_GOOGLE_SERVICES_JSON';

function main() {
  const val = process.env[ENV_NAME];
  if (!val) {
    console.log(`Environment variable ${ENV_NAME} not found. Skipping write of google-services.json.`);
    return;
  }

  try {
    // If the secret was uploaded as a file secret, EAS will provide its contents
    // in the env var. We simply write it out as-is.
    fs.writeFileSync(OUT, val, { encoding: 'utf8' });
    console.log(`Wrote ${OUT} from ${ENV_NAME}`);
  } catch (err) {
    console.error(`Failed to write ${OUT}:`, err);
    process.exit(1);
  }
}

main();
