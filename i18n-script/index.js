const fs = require("fs/promises");
const path = require("path");
const process = require("process");
const { google } = require("googleapis");
require("dotenv/config");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
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

/**
 * @param {google.auth.GoogleAuth} auth The authenticated Google OAuth client.
 */
async function listTranslate(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1MPP3fGsdRdrziT4g4SR97bIpP0gNlOKTosjmVeOU4k8",
    range: "translate!A2:E",
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  const json = createTranslateJson(rows);    
  await fs.mkdir(path.join(process.cwd(), "src/translate_json"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "src/translate_json/ko.json"), JSON.stringify(json.ko));  
  console.log("Successfully created translate_ko.json");
  await fs.writeFile(path.join(process.cwd(), "src/translate_json/en.json"), JSON.stringify(json.en));
  console.log("Successfully created translate_en.json");
  await fs.writeFile(path.join(process.cwd(), "src/translate_json/jp.json"), JSON.stringify(json.jp));
  console.log("Successfully created translate_jp.json");
}

/**
 * @param {string[][]} rows
 * @returns {object}
 */
function createTranslateJson(rows) {
  const translate = {};
  rows.forEach((row) => {
    const [page, id, ko, en, jp] = row;
    if (!translate.ko) translate.ko = {};
    if (!translate.en) translate.en = {};
    if (!translate.jp) translate.jp = {};
    if (!translate.ko[page]) translate.ko[page] = {};
    if (!translate.en[page]) translate.en[page] = {};
    if (!translate.jp[page]) translate.jp[page] = {};
    translate.ko[page][id] = ko;
    translate.en[page][id] = en;
    translate.jp[page][id] = jp;
  });

  return translate;
}

authorize().then(listTranslate).catch(console.error);
