
const { textToJSON, getTotal, createCsv, getkey } = require('./utils')
const { filterGroceryBy, mapDataBy, formatData } = require('./lib')
const sortBy = require('lodash.sortby');
const store = require('store')

const fs = require('fs');
let key = "";
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var recursiveAsyncReadLine = function () {
    rl.question(`Type one of the options :\n
    ingest <filename>\n 
    summary <category name> <year> <month>\n
    generate_report <filename>\n
    exit\n\n? `
        , function (line) {
            let values = line.split(" ")
            switch (values[0]) {
                case "ingest": {
                    const file = fs.readFileSync(values[1]).toString();
                    const isError = doIngest(file)
                    if (isError) {
                        console.log("Error")
                    } else {
                        console.log("Success")
                    }
                    break;
                }
                case "summary": {
                    const result = getSummary(values.splice(1, values.length));
                    console.log(`Produce - Total Units: ${result.totalUnits} , Total Gross Sales: ${result.grossSales.toFixed(2)}`)
                    break;
                }
                case "generate_report": {
                    const name = Date.now() + ".csv"
                    generateRepot(name)
                    console.log(name)
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

function doIngest(data) {
    let lines = data.split("\n");
    const headers = lines[0].split("\t");
    key = getkey(headers)
    if (store.get(key)) {
        return false
    }
    let result = textToJSON(headers, lines.slice(1, lines.length - 1));


    if (result) {
        store.set(key, result)
        return false
    }
    return true
}
function getSummary(values) {
    let filteredGrocery = filterGroceryBy(store.get(key),
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
    let mappedData = formatData(store.get(key))

    let filteredData = sortBy(mappedData, ["SKU", "Year", "Month"])

    const fields = ['Year', 'Month', 'SKU', 'Category', 'Units', 'GrossSales'];

    createCsv(filteredData, name, { fields })
}


