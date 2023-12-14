const fs = require('fs');
// jodi error dei then just 'npm install readline-sync' eita terminal e type korbe
const readlineSync = require('readline-sync');

// js e function use kore script likhte hoi
function convertFormat(inputFile, outputFile) {
    // amake age raw json data read korte hobe, jeta ami js r node diye korlam:
    const rawData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

    // tarpor, "datasetName" extract korlam raw data theke:
    const datasetName = inputFile.split('.')[0];

    // ekhon standard format ta initialize korlam defaul value diye (ei format required input json file read kore update hobe pore):
    const standardFormat = [{
        dataset_name: datasetName,
        image_link: '',
        annotation_type: 'image',
        annotation_objects: {
            vehicle: {
                presence: 0,
                bbox: []
            },
            license_plate: {
                presence: 0,
                bbox: []
            }
        },
        annotation_attributes: {
            vehicle: {
                Type: null,
                Pose: null,
                Model: null,
                Make: null,
                Color: null
            },
            license_plate: {
                'Difficulty Score': null,
                Value: null,
                Occlusion: null
            }
        }
    }];

    // ekhon proti ta object e jabo (iterate korbo)
    for (const obj of rawData.objects) {
        // eikhane first condition ta check korbo, class presence ase kina
        const classTitle = obj.classTitle.toLowerCase();
        const presence = obj.points.exterior.length ? 1 : 0;
        const bbox = obj.points.exterior;

        // Ei dui property 'annotation_objects and annotation_attributes properties'  initialize korlam, plus jodi class title thakeh then use korbo ei format e nahole empty object create kore {}
        standardFormat[0].annotation_objects[classTitle] = standardFormat[0].annotation_objects[classTitle] || {};
        standardFormat[0].annotation_attributes[classTitle] = standardFormat[0].annotation_attributes[classTitle] || {};

        // class title presence thakle count hobe
        standardFormat[0].annotation_objects[classTitle].presence = presence;
        standardFormat[0].annotation_objects[classTitle].bbox = bbox;

        // Iterate through tags and update attributes in the standard format
        for (const tag of obj.tags) {
            const tagName = tag.name;
            const tagValue = tag.value;
            standardFormat[0].annotation_attributes[classTitle][tagName] = tagValue;
        }
    }

    // Write the formatted data to a new JSON file
    fs.writeFileSync(outputFile, JSON.stringify(standardFormat, null, 2));
    console.log(`Formatted data saved to: ${outputFile}`);
}

// Ask the user to locate the input file
const inputFile = readlineSync.question('Please enter the path to the input file: ');

// Specify the output file name
const outputFile = 'the_formatted_output.json';

// Process the input file and save as the formatted output file
convertFormat(inputFile, outputFile);
