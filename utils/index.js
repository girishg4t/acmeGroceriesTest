const { Parser } = require('json2csv');
const fs = require('fs');

/**
 * Convert text into json
 * @param {head of the text file} headers 
 * @param {data of the text file} lines 
 */
function textToJSON(headers, lines) {
    var result = [];
    let isError = false
    for (var i = 0; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");
        for (let j = 0; j < headers.length; j++) {
            if (j > 1) {
                if (isNaN(currentline[j])) {
                    isError = true
                    break;
                }
            }
            obj[headers[j]] = currentline[j];
        }
        if (isError) {
            result = null
            break
        }
        result.push(obj);
    }
    return result;
}

function getkey(headers) {
    let from = headers[2].split(" ")[0]
    let to = headers[headers.length - 1].split(" ")[0]
    return from + " " + to
}

/**
 * Get the total based on field passed
 * @param {data to be reduced} arr 
 * @param {for which field total is calculated} field 
 */
function getTotal(arr, field) {
    return arr.reduce(function (prev, cur) {
        return prev + parseInt(cur[field])
    }, 0);
}

/**
 * Create the csv file
 * @param {array based on which csv file need to created} data 
 * @param {name of the file} name 
 * @param {fields need to be present in the file} opts 
 */
function createCsv(data, name, opts) {
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        fs.writeFileSync(name, csv);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    textToJSON,
    getTotal,
    createCsv,
    getkey
}
