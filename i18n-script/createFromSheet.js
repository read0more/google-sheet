const fs = require("fs/promises");
const path = require("path");
const process = require("process");
const { google } = require("googleapis");
const { authorize } = require("./authorize");
require("dotenv/config");

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

  const json = parseRowsToObject(rows);    
  await fs.mkdir(path.join(process.cwd(), "src/i18n"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "src/i18n/ko.json"), JSON.stringify(json.ko));  
  console.log("Successfully created translate_ko.json");
  await fs.writeFile(path.join(process.cwd(), "src/i18n/en.json"), JSON.stringify(json.en));
  console.log("Successfully created translate_en.json");
  await fs.writeFile(path.join(process.cwd(), "src/i18n/jp.json"), JSON.stringify(json.jp));
  console.log("Successfully created translate_jp.json");
}

/**
 * @param {string[][]} rows
 * @returns {object}
 */
function parseRowsToObject(rows) {
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
