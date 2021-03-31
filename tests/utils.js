var expect = require("chai").expect;
var { getTotal, textToJSON } = require("../utils");
var mocha = require('mocha')
var it = mocha.it
var describe = mocha.describe

describe("Verify utils", function () {
    it("check if total is getting calculated correctly", function () {
        var result = getTotal([{ "sales": 10 }, { "sales": 20 }, { "sales": 30 }], "sales")
        expect(result).to.equal(60);
    });
    it("Check if text is converted to json correctly", function () {
        var data = `SKU	Section	2018-12 Units	2018-12 Gross Sales	2019-1 Units	2019-1 Gross Sales	2019-2 Units	2019-2 Gross Sales	2019-3 Units	2019-3 Gross Sales	2019-4 Units	2019-4 Gross Sales	2019-5 Units	2019-5 Gross Sales
        1009966	International	834	1626.3	876	1708.2	867	1690.65	910	1774.5	910	1774.5	910	1774.5
        1023132	Produce	194	3296.06	198	3364.02	194	3296.06	202	3431.98	206	3499.94	220	3737.8
        1028684	Freezer	465	8718.75	479	8981.25	503	9431.25	518	9712.5	544	10200	528	9900
        1041002	Produce	523	8362.77	539	8618.61	528	8442.72	549	8778.51	554	8858.46	526	8410.74`
        let lines = data.split("\n");
        const headers = lines[0].split("\t");
        var result = textToJSON(headers, lines.slice(1, lines.length))
        console.log(result)
        expect(result.length).to.equal(4);
        expect(result[3].SKU.trim()).to.equal("1041002");
        expect(result[3]["2019-5 Gross Sales"]).to.equal("8410.74");        
    })
});