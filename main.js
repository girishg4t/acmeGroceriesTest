
const { textToJSON, getTotal, createCsv } = require('./utils')
const { filterGroceryBy, mapDataBy, formatData, mergeData } = require('./lib')
const sortBy = require('lodash.sortby');
const store = require('store')
const XLSX = require('xlsx')
const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const recursiveAsyncReadLine = function () {
    rl.question(`Type one of the options :\n
    ingest <filename>\n 
    summary <category name> <year> <month>\n
    generate_report <filename>\n
    exit\n\n? `
        , function (line) {
            let values = line.split(" ")
            switch (values[0].trim()) {
                case "ingest": {
                    const e = values[1].split(".")
                    let extention = e[e.length - 1]
                    let recentData = "";
                    if (extention == "xlsx") {
                        var workbook = XLSX.readFile(values[1]);
                        recentData = XLSX.utils.sheet_to_json(workbook.Sheets["Sales"]);
                    } else {
                        const fileData = fs.readFileSync(values[1]).toString();
                        let lines = fileData.split("\n");
                        const headers = lines[0].split("\t");
                        recentData = textToJSON(headers, lines.slice(1, lines.length));
                    }
                    if (recentData == null) {
                        console.log("Error")
                        break
                    }
                    if (store.get("data")) {
                        let finalData = mergeData(store.get("data"), recentData)
                        store.set("data", finalData)
                    } else {
                        store.set("data", recentData)
                    }
                    console.log("Success")
                    break;
                }
                case "summary": {
                    const result = getSummary(values.splice(1, values.length));
                    if (result.grossSales == 0 && result.totalUnits == 0) {
                        console.log("No data available")
                        break
                    }
                    console.log(`Produce - Total Units: ${result.totalUnits} , Total Gross Sales: ${result.grossSales.toFixed(2)}`)
                    break;
                }
                case "generate_report": {                   
                    generateRepot(values[1])
                    break;
                }
                case "exit":
                    rl.close();
                    break;
            }
            recursiveAsyncReadLine(); //Calling this function again to ask new question
        });
};

recursiveAsyncReadLine();



rl.on("close", function () {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});

function getSummary(values) {
    let filteredGrocery = filterGroceryBy(store.get("data"),
        { "Section": values[0] });

    let year = values[1]
    let month = values[2]
    let yearMonth = year + "-" + month
    filteredGrocery = mapDataBy(filteredGrocery, {
        "Units": yearMonth + " Units",
        "GrossSales": yearMonth + " Gross Sales"
    })
    let totalUnits = getTotal(filteredGrocery, "Units");

    let grossSales = getTotal(filteredGrocery, "GrossSales")

    return {
        totalUnits,
        grossSales
    }
}


function generateRepot(name) {
    let mappedData = formatData(store.get("data"))
    let filteredData = sortBy(mappedData, ["SKU", "Year", "Month"])
    const fields = ['Year', 'Month', 'SKU', 'Category', 'Units', 'GrossSales'];
    createCsv(filteredData, name, { fields })
}


