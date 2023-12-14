const fs = require('fs');

// Read the test JSON files
const json1 = require('./the files/pos_0.png.json');
const json2 = require('./the files/pos_10010.png.json');
const json3 = require('./the files/pos_10492.png.json');

// Combine the test JSONs into a single JSON
const combinedJson = {
  description: "",
  tags: [],
  size: {
    height: 720,
    width: 1280
  },
  objects: [...json1.objects, ...json2.objects, ...json3.objects]
};

// Change class names as specified
combinedJson.objects.forEach(obj => {
  if (obj.classTitle === "Vehicle") {
    obj.classTitle = "car";
  } else if (obj.classTitle === "License Plate") {
    obj.classTitle = "number";
  }
});

// Write the combined and modified JSON to a file
const outputFile = 'combined_and_modified.json';
fs.writeFileSync(outputFile, JSON.stringify(combinedJson, null, 2));

console.log(`Combined and modified JSON saved to ${outputFile}`);
