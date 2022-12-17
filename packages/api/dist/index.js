"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8001;
app.use((0, cors_1.default)({ origin: "*" }));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.get("/api/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield googleapis_1.google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata",
        ],
    });
    const sheets = googleapis_1.google.sheets({ version: "v4", auth });
    const drive = googleapis_1.google.drive({ version: "v3", auth });
    // const range = `Sheet1!A${1}:C${1}`;
    const range = `Sheet1`;
    const sheetId = req.params.id || "1dcunyzF1it2fBmcO_HKea6O2sr2mIS5kBE5z_ER9p5E";
    const response = yield sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    const lastUpdated = yield drive.files.get({
        fileId: sheetId,
        fields: "modifiedTime",
    });
    console.log();
    if (response.data.values) {
        let values = response.data.values;
        let header = values.shift();
        if (header) {
            let returnData = {
                modifiedTime: lastUpdated.data.modifiedTime,
                items: values.reduce((acc, current) => {
                    acc.push(header.reduce((obj, col, i) => {
                        obj[col] = current[i];
                        return obj;
                    }, {}));
                    return acc;
                }, []),
            };
            return res.status(200).json(returnData);
        }
    }
    else {
        return res.status(404).json([]);
    }
}));
function itemsToSheetValues(items) {
    let acc = [];
    if (items.length > 0) {
        acc.push(Object.keys(items[0]));
        items.forEach((item) => {
            acc.push(Object.values(item));
        });
    }
    return acc;
}
app.post("/api/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield googleapis_1.google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata",
        ],
    });
    const sheets = googleapis_1.google.sheets({ version: "v4", auth });
    // const range = `Sheet1!A${1}:C${1}`;
    const range = `Sheet1`;
    const sheetId = req.body.sheetId || "1dcunyzF1it2fBmcO_HKea6O2sr2mIS5kBE5z_ER9p5E";
    try {
        const clearResponse = yield sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range,
        });
        const response = yield sheets.spreadsheets.values.update({
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
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
