
const { textToJSON, getTotal, createCsv } = require('./utils')
const { filterGroceryBy, mapDataBy, formatData, mergeData } = require('./libs')
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
            let args = line.split(" ")
            switch (args[0].trim()) {
                case "ingest": {
                    try {
                        const e = args[1].split(".")
                        let extention = e[e.length - 1]
                        let recentData = "";
                        if (extention == "xlsx") {
                            //Read xlsx file
                            var workbook = XLSX.readFile(args[1]);
                            recentData = XLSX.utils.sheet_to_json(workbook.Sheets["Sales"]);
                        } else {
                            //Read text file
                            const fileData = fs.readFileSync(args[1]).toString();
                            let lines = fileData.split("\n");
                            const headers = lines[0].split("\t");
                            recentData = textToJSON(headers, lines.slice(1, lines.length));
                        }
                        if (recentData == null) {
                            console.log("Error")
                            break
                        }
                        if (store.get("data")) {
                            //merge if data is already ingested
                            let finalData = mergeData(store.get("data"), recentData)
                            store.set("data", finalData)
                        } else {
                            store.set("data", recentData)
                        }
                        console.log("Success")
                        break;
                    } catch (err) {
                        console.log("Error")
                        break
                    }
                }
                case "summary": {
                    //Get the total of units and gross sales
                    const result = getSummary(args.splice(1, args.length));
                    if (result.grossSales == 0 && result.totalUnits == 0) {
                        console.log("No data available")
                        break
                    }
                    console.log(`Produce - Total Units: ${result.totalUnits} , Total Gross Sales: ${result.grossSales.toFixed(2)}`)
                    break;
                }
                case "generate_report": {
                    //Generate the report
                    generateRepot(args[1])
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

/**
 * Get the summary base on criteria
 * @param {* param require to get the summary} args 
 */
function getSummary(args) {
    let grocerySummary = filterGroceryBy(store.get("data"),
        { "Section": args[0] });

    let year = args[1]
    let month = args[2]
    let yearMonth = year + "-" + month
    grocerySummary = mapDataBy(grocerySummary, {
        "Units": yearMonth + " Units",
        "GrossSales": yearMonth + " Gross Sales"
    })
    let totalUnits = getTotal(grocerySummary, "Units");

    let grossSales = getTotal(grocerySummary, "GrossSales")

    return {
        totalUnits,
        grossSales
    }
}

/**
 * Generate the csv file in the given format
 * @param {name for the file to be created} name 
 */
function generateRepot(name) {
    let mappedData = formatData(store.get("data"))
    let filteredData = sortBy(mappedData, ["SKU", "Year", "Month"])
    const fields = ['Year', 'Month', 'SKU', 'Category', 'Units', 'GrossSales'];
    createCsv(filteredData, name, { fields })
}


