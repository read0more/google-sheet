const { google } = require("googleapis");
const { authorize } = require("./authorize");
require("dotenv/config");
const newKeys = require("../src/i18n/newKeys");

/**
 * @param {google.auth.GoogleAuth} auth The authenticated Google OAuth client.
 */
async function uploadTranslate(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1MPP3fGsdRdrziT4g4SR97bIpP0gNlOKTosjmVeOU4k8",
    range: "translate!A2:E",
  });

  const rows = res.data.values ?? [];

  function flattenMessages(nestedMessages, prefix = "") {
    return Object.keys(nestedMessages).reduce((messages, key) => {
      let value = nestedMessages[key];
      let prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {});
  }

  const koJson = flattenMessages(newKeys);
  const koKeys = Object.keys(koJson);

  const koKeysNotInRes = koKeys.filter((key) => {
    return !rows.some((row) => {
      return `${row[0]}.${row[1]}` === key;
    });
  });

  const newRows = [];
  koKeysNotInRes.forEach((key) => {
    const [pageName, translateId] = key.split(".");
    const row = [pageName, translateId, koJson[key], "", ""];
    console.log("newKeys.js에 있어 sheet에 추가 될 키: ", key);
    newRows.push(row);
  });

  if (newRows.length === 0) {
    console.log("No new keys found.");
    return;
  }

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: "1MPP3fGsdRdrziT4g4SR97bIpP0gNlOKTosjmVeOU4k8",
    range: "from_dev!A2:E",
    valueInputOption: "RAW",
    resource: {
      values: newRows,
    },
  });

  console.log(`${result.data.updatedCells} cells updated.`);
}

authorize().then(uploadTranslate).catch(console.error);
