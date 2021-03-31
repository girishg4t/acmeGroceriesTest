const { Parser } = require('json2csv');
const fs = require('fs');

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
function checkIfDataExists(data, obj) {
   const isFound = data.find((line)=>{
        return line.SKU == obj.SKU && obj.Section == line.Section
    })
    return isFound
}
function getkey(headers) {
    let from = headers[2].split(" ")[0]
    let to = headers[headers.length - 1].split(" ")[0]
    return from + " " + to
}

function getTotal(arr, field) {
    return arr.reduce(function (prev, cur) {
        return prev + parseInt(cur[field])
    }, 0);
}

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
