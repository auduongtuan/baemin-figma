import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8001;
app.use(cors({ origin: "*" }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.get("/api/:id", async (req: Request, res: Response) => {
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });
  // const range = `Sheet1!A${1}:C${1}`;
  const range = `Sheet1`;
  const sheetId =
    req.params.id || "1dcunyzF1it2fBmcO_HKea6O2sr2mIS5kBE5z_ER9p5E";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const sheetFile = await drive.files.get({
    fileId: sheetId,
    // fields: "modifiedTime",
    fields: "*",
  });
  console.log();
  if (response.data.values) {
    let values = response.data.values;
    let header = values.shift() as string[];
    if (header) {
      let returnData = {
        sheetName: sheetFile.data.name,
        modifiedTime: sheetFile.data.modifiedTime,
        items: values.reduce((acc, current) => {
          acc.push(
            header.reduce((obj, col, i) => {
              obj[col] = current[i];
              return obj;
            }, {} as Record<string, string>)
          );
          return acc;
        }, []),
      };
      return res.status(200).json(returnData);
    }
  } else {
    return res.status(404).json([]);
  }
});

interface LocaleItem {
  key: string;
  en?: string;
  vi?: string;
}

function itemsToSheetValues(items: LocaleItem[]): string[][] {
  let acc = [];
  if (items.length > 0) {
    acc.push(Object.keys(items[0]));
    items.forEach((item) => {
      acc.push(Object.values(item));
    });
  }
  return acc;
}

app.post("/api/update", async (req: Request, res: Response) => {
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  // const range = `Sheet1!A${1}:C${1}`;
  const range = `Sheet1`;
  const sheetId =
    req.body.sheetId || "1dcunyzF1it2fBmcO_HKea6O2sr2mIS5kBE5z_ER9p5E";
  try {
    const clearResponse = await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range,
    });
    const response = await sheets.spreadsheets.values.update({
      // includeValuesInResponse: true,
      spreadsheetId: sheetId,
      valueInputOption: "USER_ENTERED",
      range,
      requestBody: {
        range,
        values: itemsToSheetValues(req.body.items),
      },
    });

    console.log(response);
  
    return res.status(200).json({ status: "ok" });
    // }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
