const fs = require('fs');

const jsonFilePath = 'C:\\Users\\yoshi\\PycharmProjects\\TheBeerNameGenerator\\lists\\beer_data.json';

// Functie om JSON te herformatteren met meerdere items per regel
function compactJsonFile(filePath, itemsPerLine = 5) {
  try {
    // Lees het JSON-bestand
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Functie om arrays te herformatteren
    function formatCompactArray(array) {
      // Eerst sorteren (indien gewenst)
      const sortedArray = [...array].sort();

      // Groepeer items in blokken
      let result = '[\n';
      for (let i = 0; i < sortedArray.length; i += itemsPerLine) {
        const chunk = sortedArray.slice(i, i + itemsPerLine);
        result += '  ' + chunk.map(item => JSON.stringify(item)).join(', ');
        if (i + itemsPerLine < sortedArray.length) {
          result += ',\n';
        } else {
          result += '\n';
        }
      }
      result += ']';
      return result;
    }

    // Maak een nieuw JSON-string met compacter formaat
    let compactJson = '{';
    const keys = Object.keys(jsonData);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      compactJson += `\n  ${JSON.stringify(key)}: `;

      if (Array.isArray(jsonData[key])) {
        compactJson += formatCompactArray(jsonData[key]);
      } else {
        compactJson += JSON.stringify(jsonData[key]);
      }

      if (i < keys.length - 1) {
        compactJson += ',';
      }
    }

    compactJson += '\n}';

    // Schrijf het gecompacteerd formaat terug naar het bestand
    fs.writeFileSync(filePath, compactJson);
    console.log(`JSON in ${filePath} is gecomprimeerd!`);
  } catch (error) {
    console.error(`Fout bij het comprimeren van ${filePath}:`, error);
  }
}

// Voer de compressie uit met 5 items per regel (pas dit aan naar wens)
compactJsonFile(jsonFilePath, 5);