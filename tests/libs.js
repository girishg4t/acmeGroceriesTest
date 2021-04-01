var expect = require("chai").expect;
var { filterGroceryBy, mapDataBy, createCustomObjects, mergeData } = require("../libs");
var mocha = require('mocha')
var it = mocha.it
var describe = mocha.describe

var data = [
    {
        SKU: '        1009966',
        Section: 'International',
        '2018-12 Units': '834',
        '2018-12 Gross Sales': '1626.3',
        '2019-1 Units': '876',
        '2019-1 Gross Sales': '1708.2',
        '2019-2 Units': '867',
        '2019-2 Gross Sales': '1690.65',
        '2019-3 Units': '910',
        '2019-3 Gross Sales': '1774.5',
        '2019-4 Units': '910',
        '2019-4 Gross Sales': '1774.5',
        '2019-5 Units': '910',
        '2019-5 Gross Sales': '1774.5'
    },
    {
        SKU: '        1023132',
        Section: 'Produce',
        '2018-12 Units': '194',
        '2018-12 Gross Sales': '3296.06',
        '2019-1 Units': '198',
        '2019-1 Gross Sales': '3364.02',
        '2019-2 Units': '194',
        '2019-2 Gross Sales': '3296.06',
        '2019-3 Units': '202',
        '2019-3 Gross Sales': '3431.98',
        '2019-4 Units': '206',
        '2019-4 Gross Sales': '3499.94',
        '2019-5 Units': '220',
        '2019-5 Gross Sales': '3737.8'
    },
    {
        SKU: '        1028684',
        Section: 'Freezer',
        '2018-12 Units': '465',
        '2018-12 Gross Sales': '8718.75',
        '2019-1 Units': '479',
        '2019-1 Gross Sales': '8981.25',
        '2019-2 Units': '503',
        '2019-2 Gross Sales': '9431.25',
        '2019-3 Units': '518',
        '2019-3 Gross Sales': '9712.5',
        '2019-4 Units': '544',
        '2019-4 Gross Sales': '10200',
        '2019-5 Units': '528',
        '2019-5 Gross Sales': '9900'
    },
    {
        SKU: '        1041002',
        Section: 'Produce',
        '2018-12 Units': '523',
        '2018-12 Gross Sales': '8362.77',
        '2019-1 Units': '539',
        '2019-1 Gross Sales': '8618.61',
        '2019-2 Units': '528',
        '2019-2 Gross Sales': '8442.72',
        '2019-3 Units': '549',
        '2019-3 Gross Sales': '8778.51',
        '2019-4 Units': '554',
        '2019-4 Gross Sales': '8858.46',
        '2019-5 Units': '526',
        '2019-5 Gross Sales': '8410.74'
    }
]
let newData = [
    {
        "2018-11 Units": 818,
        "2018-11 Gross Sales": 1595.1,
        "2018-12 Units": 834,
        "2018-12 Gross Sales": 1626.3,
        "2019-1 Units": 876,
        "2019-1 Gross Sales": 1708.2,
        "2019-2 Units": 867,
        "2019-2 Gross Sales": 1690.66,
        "2019-3 Units": 910,
        "2019-3 Gross Sales": 1774.5,
        "2019-4 Units": 910,
        "2019-4 Gross Sales": 1774.5,
        "Section": 'International',
        "SKU": 1009966
    },
    {
        "2018-11 Units": 818,
        "2018-11 Gross Sales": 1595.1,
        "2018-12 Units": 834,
        "2018-12 Gross Sales": 1626.3,
        "2019-1 Units": 876,
        "2019-1 Gross Sales": 1708.2,
        "2019-2 Units": 867,
        "2019-2 Gross Sales": 1690.66,
        "2019-3 Units": 910,
        "2019-3 Gross Sales": 1774.5,
        "2019-4 Units": 910,
        "2019-4 Gross Sales": 1774.5,
        "Section": 'International',
        "SKU": 1009967
    }
]
describe("Verify libs", function () {
    it("filter data by category", function () {
        let filteredGrocery = filterGroceryBy(data,
            { "Section": "Produce" });
        expect(filteredGrocery.length).to.equal(2);
        expect(filteredGrocery[1].SKU.trim()).to.equal("1041002");
    });
    it("Map data by Units and GrossSales", function () {
        let yearMonth = "2019-1"
        let filteredGrocery = mapDataBy(data, {
            "Units": yearMonth + " Units",
            "GrossSales": yearMonth + " Gross Sales"
        })
        expect(filteredGrocery.length).to.equal(4);
        expect(filteredGrocery[0]['Units']).to.equal('876');
        expect(filteredGrocery[0]['GrossSales']).to.equal('1708.2');
    });
    it("Create custom object", function () {
        let result = createCustomObjects(data[0])       
        expect(result.length).to.equal(6);
        expect(result[1].Year).to.equal('2019')
        expect(result[1].Month).to.equal('1')
    });
    it("Check if data is getting merged", function () {
        let result = mergeData(data, newData)
        expect(result.length).to.equal(5);
        expect(result[3]["2019-2 Gross Sales"]).to.equal(1690.66);        
    })
});