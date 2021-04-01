/**
 * Filter array in given format
 * @param {array to be filtered} data 
 * @param {condition on which need to be filtered} criteria 
 */
function filterGroceryBy(data, criteria) {
    let produces = data.filter((pro) => {
        var cond = true
        Object.keys(criteria).forEach((key) => {
            cond = pro[key].trim() == criteria[key] && cond
        })
        return cond
    })
    return produces
}

/**
 * Map array in given object format
 * @param {array to be mapped} data 
 * @param {object/fields in which it to be mapped} fields 
 */
function mapDataBy(data, fields) {
    return data.map((elm) => {
        let obj = {}
        Object.keys(fields).forEach((key) => {
            obj[key] = elm[fields[key]] || 0
        })
        return obj
    });
}

/**
 * format the array in given structure
 * @param {input array} data 
 */
function formatData(data) {
    return data.map((elm) => {
        return createCustomObjects(elm)
    }).reduce(function (prev, next) {
        return prev.concat(next);
    });
}

/**
 * Structure the row in custom object
 * @param {each row in the arrat} row 
 */
function createCustomObjects(row) {
    let output = []
    let keys = Object.keys(row)
    for (let i = 2; i < keys.length; i++) {
        let newObj = {}
        var n = keys[i].split(/-| /)
        newObj.Year = n[0]
        newObj.Month = n[1]
        newObj[n.splice(2, n.length).join("").trim()] = parseFloat(row[keys[i]]).toFixed(2);
        i++
        n = keys[i].split(/-| /)
        newObj[n.splice(2, n.length).join("").trim()] = parseFloat(row[keys[i]]).toFixed(2);
        newObj.SKU = parseInt(row.SKU)
        newObj.Category = row.Section
        output.push(newObj)
    }
    return output
}
/**
 * Merge the array if the SKU is equal else add 
 * Also merge the recent data i.e.(if the same values are present it is overwritten by latest one)
 * @param {first array} first 
 * @param {second array} second 
 */
function mergeData(first, second) {
    let newArr = [...first]
    for (let i = 0; i < second.length; i++) {
        let foundIndex = -1
        let found = first.find((row, curIndex) => {
            foundIndex = curIndex
            return row.SKU.toString().trim() == second[i].SKU.toString().trim()
        })
        if (found) {
            newArr.splice(foundIndex, 1)
            foundIndex = -1
            //if the same values are present it is overwritten by latest one
            let newObj = { ...found, ...second[i] }
            newArr.push(newObj)
        } else {
            foundIndex = -1
            newArr.push(second[i])
        }
    }
    return newArr;
}


module.exports = {
    formatData,
    filterGroceryBy,
    mapDataBy,
    mergeData,
    createCustomObjects
}