const maxDex = 492;

// Fetch list of all Pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=964')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        const pokedex = new Pokedex(data);
        pokedex.selectRandom();
        console.log(`Selected ${pokedex.currentSelection} - ${pokedex.allEntries[pokedex.currentSelection].name.toUpperCase()}`);
    })
    .catch((status) => {
        console.log(status);
    })

// Constructor
function Pokedex(input) {
    this.allEntries = [...input.results.slice(0, maxDex)];
    this.entryCount = this.allEntries.length;

    // TO DO ==== 3 DECIMAL PLACES FOR ID CONSISTANCY   
    this.currentSelection;

    // Select indexed pokemon
    this.select = function(i) {
        if (i <= this.allEntries.length) {
            this.currentSelection = i; // Update current selection
            return this.allEntries[i].name;
        } else {
            console.log(`Enter value less than ${this.allEntries.length}`);
        }
        
    }   

    // Select random pokemon
    this.selectRandom = function() {
        const rand = Math.ceil(Math.random() * this.allEntries.length); // Select random pokemon within range of available entries
        this.currentSelection = rand; // Update current selection
        return this.allEntries[rand];
    }
}