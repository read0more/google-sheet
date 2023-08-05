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

  const result = {};

  rows.forEach((row) => {
    const [page, id, ko, en, jp] = row;
    result[`${page}.${id}`] = {
      ko,
      en,
      jp
    }
  });

  return result;
}

function getI18nFromDrive() {
  return {
    'common.vorpal': {
      'ko': '보팔',
      'en': 'Vorpal',
      'jp': 'ボルパル',
    },
  }
}

function compareI18n(i18nFromSheet, i18nFromDrive) {
  const newObjects = [];
  const updateObjects = [];

  Object.keys(i18nFromSheet).forEach((key) => {
    if (!i18nFromDrive[key]) {
      newObjects.push({
        [key]: i18nFromSheet[key]
      });
    } else {
      const sheetObject = i18nFromSheet[key];
      const driveObject = i18nFromDrive[key];
      if (sheetObject.ko !== driveObject.ko || sheetObject.en !== driveObject.en || sheetObject.jp !== driveObject.jp) {
        updateObjects.push({
          [key]: i18nFromSheet[key]
        });
      }
    }
  });

  return {
    newObjects,
    updateObjects
  }
}

async function run() {
  const auth = await authorize();
  const i18nFromSheet = await listTranslate(auth);
  const i18nFromDrive = getI18nFromDrive();

  // TODO: upload to drive

  console.log(compareI18n(i18nFromSheet, i18nFromDrive));
}

run();
