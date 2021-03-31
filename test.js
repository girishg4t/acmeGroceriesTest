
const { textToJSON } = require('./utils')
var XLSX = require('xlsx')
var workbook = XLSX.readFile('./201904.xlsx');
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Sales"]);
import { sales } from './config/sales'
//console.log(xlData);

let lines = sales.split("\n");
const headers = lines[0].split("\t");

let result = textToJSON(headers, lines.slice(1, lines.length - 1));

for (let i = 0; i < result.length; i++) {
    let found = xlData.find((row) => {
        return row.SKU == result[i].SKU
    })
    if (found) {
        console.log(xlData.length)
        xlData.remove(found)
        console.log(xlData.length)
    }
}