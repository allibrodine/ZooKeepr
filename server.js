const { json } = require('body-parser');
const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const { ppid } = require('process');
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());
//make css and js files readily availble
app.use(express.static('public'));

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
        if (result) {
            res.json(result);
        } else {
            res.send(404);
        }
});

app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(req.body);
    }
});
//route to index.html homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

//https://frozen-sea-03519.herokuapp.com/api/animals