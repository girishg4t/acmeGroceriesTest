# Acme Groceries Report

### Working:
Please check ```demo.mp4``` in the current folder

### Assumptions:

- Files should be uploaded in sequence i.e. if there are 2 file need to ingested for January-June 2018 and February-July 2018 then January file should be submitted first
- All ingested files are taken from current(root) folder of the project and new is also generated in same folder

### Functionality:

- Data in both the file is getting merged based on SKU
- While merge, If no SKU is found in old file then it is added in merged data
- If SKU is found, then duplicate data is getting overwritten with new one (even if the value is greater)
- Merged/Single data is saved in store and is used for further merge, when new file is ingested
- Written unit test cases in tests folder for utils and libs package
- Added comments on each method
- Almost handled all the scenarios

### Notes:

- I have check the text file for any invalid data but not the excel sheet
- For generating report, data is converted into custom object, the logic is more rigid
- Code can be more optimized
- Due to lack of understanding, some of the criteria is not handled i.e. (If this is the application’s first time encountering this SKU, use the category associated with the highest number of sales in the most recent month in the given file. However, once an item is assigned a category, the category doesn’t change, even if it’s different on a new input file)

### How to run

```bash
npm install
npm start
```

### How to run Test cases

```bash
npm test
```

#### Generated report
Please find ```generatedReport.csv``` in the current folder
