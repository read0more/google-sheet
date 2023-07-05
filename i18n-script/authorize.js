const path = require("path");
const process = require("process");
const { google } = require("googleapis");
require("dotenv/config");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// production의 경우 client_secret.json은 github actions secrets.GOOGLE_SHEET_CLIENT_SECRET를 통해 생성됨
const KEY_FILE = path.join(process.cwd(), "client_secret.json");

/**
 *
 * @returns {Promise<google.auth.GoogleAuth>}
 * @throws {Error}
 */
async function authorize() {
  try {
    return new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: SCOPES,
      // client_secret.json대신 .env 사용 하고 싶다면 아래 주석 해제
      // credentials: {
      //   type: process.env["TYPE"],
      //   project_id: process.env["PROJECT_ID"],
      //   private_key_id: process.env["PRIVATE_KEY_ID"],
      //   private_key: process.env["PRIVATE_KEY"],
      //   client_email: process.env["CLIENT_EMAIL"],
      //   client_id: process.env["CLIENT_ID"],
      //   auth_uri: process.env["AUTH_URI"],
      //   token_uri: process.env["TOKEN_URI"],
      //   auth_provider_x_509_cert_url:
      //     process.env["AUTH-PROVIDER-X-509-CERT-URL"],
      //   client_x_509_cert_url: process.env["CLIENT-X-509-CERT-URL"],
      //   universe_domain: process.env["UNIVERSE_DOMAIN"],
      // },
    });
  } catch (err) {
    return null;
  }
}

module.exports = {
  authorize,
};