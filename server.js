const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require('./data/animals.json');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //save the animalsArray as filtered results here:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        //save personalityTrait as a dedicated array. If peronsalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        } 
        //loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => { 
            //check the trait against each animal in the fileredResultsArray
            //updates the animals array for each trait in the forEach()loop
            //for each trait targeted by the filter, the filteredResults array will then contain only the entries that containt the trait
            //at the end, we'll have an array of animals that have every one of the traits when the forEach() loop is finished
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


app.get('/api/animals', (req, res) => {
    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});