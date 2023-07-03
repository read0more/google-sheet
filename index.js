import fs from "fs/promises";
import path from "path";
import process from "process";
import { google } from "googleapis";
import "dotenv/config";

console.log(process.env.UNIVERSE_DOMAIN);

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// const KEY_FILE = path.join(process.cwd(), "client_secret.json");

/**
 *
 * @returns {Promise<google.auth.GoogleAuth>}
 * @throws {Error}
 */
async function authorize() {
  try {
    return new google.auth.GoogleAuth({
      // .env대신 client_secret.json 파일 사용 하고 싶다면 아래 주석 해제
      // keyFile: KEY_FILE, 
      scopes: SCOPES,
      credentials: {
        type: process.env["TYPE"],
        project_id: process.env["PROJECT_ID"],
        private_key_id: process.env["PRIVATE_KEY_ID"],
        private_key: process.env["PRIVATE_KEY"],
        client_email: process.env["CLIENT_EMAIL"],
        client_id: process.env["CLIENT_ID"],
        auth_uri: process.env["AUTH_URI"],
        token_uri: process.env["TOKEN_URI"],
        auth_provider_x_509_cert_url:
          process.env["AUTH-PROVIDER-X-509-CERT-URL"],
        client_x_509_cert_url: process.env["CLIENT-X-509-CERT-URL"],
        universe_domain: process.env["UNIVERSE_DOMAIN"],
      },
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
  await fs.writeFile("translate.json", JSON.stringify(json));
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
