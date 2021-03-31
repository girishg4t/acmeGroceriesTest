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

function mapDataBy(data, fields) {
    return data.map((elm) => {
        let obj = {}
        Object.keys(fields).forEach((key) => {
            obj[key] = elm[fields[key]] || 0
        })
        return obj
    });
}
function formatData(data) {
    return data.map((elm) => {
        return createCustomObjects(elm)
    }).reduce(function (prev, next) {
        return prev.concat(next);
    });
}

function createCustomObjects(elm) {
    let output = []
    let keys = Object.keys(elm)
    for (let i = 2; i < keys.length; i++) {
        let newObj = {}
        var n = keys[i].split(/-| /)
        newObj.Year = n[0]
        newObj.Month = n[1]
        newObj[n.splice(2, n.length).join("")] = elm[keys[i]]
        i++
        n = keys[i].split(/-| /)
        newObj[n.splice(2, n.length).join("")] = elm[keys[i]]
        newObj.SKU = elm.SKU.trim()
        newObj.Category = elm.Section
        output.push(newObj)
    }
    return output
}
module.exports = {
    formatData,
    filterGroceryBy,
    mapDataBy
}