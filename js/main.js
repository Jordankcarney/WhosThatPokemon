const maxDex = 493; // Adjust this to include max entries for the dex. Gen I = 150, Gen II = 250, Gen III = 385, Gen IV = 492, etc.
const apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${maxDex}`;
const apiPKM = `https://pokeapi.co/api/v2/pokemon/`;
const imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
let score = 0;
let cheatsEnabled = false;

const usrInputElmt = document.getElementById("userInput");
const scoreElmt = document.getElementById("score");
const dispPokemon = document.getElementById("dispPokemon");
const cheats = document.getElementById("cheats")

runGame();

function runGame() {

    updateScore(0);
    usrInputElmt.nodeValue = "";
    // Fetch the dex entries
    fetch(apiURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            data = data.results;
            console.log(data);

            const pokedex = new Pokedex(data); // Instantiate the Pokedex
            console.log("Pokedex instantiated!");

            newTurn();

            async function newTurn() {
                pokedex.selectRandom();

                // Fetch the image
                console.log(pokedex.indexCurrent);
                fetch(pokedex.currentSelection.url)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        fetch(data.forms[0].url)
                            .then((response => {
                                return response.json();
                            }))
                            .then((data) => {
                                if (!pokedex.currentSelection.img) {
                                    pokedex.setImg(pokedex.indexCurrent, data.sprites.front_default);
                                }
                                
                                dispPokemon.src = pokedex.currentSelection.img; // show the pokemon
                            })
                    })

                    
                if(cheatsEnabled == true) {
                    enableCheats();
                    cheats.innerText = pokedex.currentSelection.name;
                }

                console.log(pokedex.currentSelection);
    
                // Start the first turn.
                


            usrInputElmt.addEventListener("input", tryValidate);
            }
            
            function tryValidate() {


                if (usrInputElmt.value.toLowerCase() == pokedex.currentSelection.name) {

                    usrInputElmt.value = null; // Reset user input

                    score++; // Increment and update the score
                    updateScore(score);

                    console.log(score); // log the score
                    
                    newTurn();
                } 

                else if (usrInputElmt.value == "cheatson" ) {
                    console.log("Cheats On!");
                    cheats.innerText = pokedex.currentSelection.name;
                    enableCheats();
                }
            };

            
        })

}

function updateScore(int) {
    scoreElmt.innerText = int;
}

function enableCheats() {
    cheats.style.display = "block";
    cheatsEnabled = true;
}


// Constructor for Pokedex
function Pokedex(input) {
    this.index = [...input.slice(0, maxDex)];
    this.indexCount = this.index.length;
    this.indexCurrent = 0;  // Default to 0, which is Bulbasuar
    this.currentSelection; 
    this.imgLink = "";


    this.setImg = (i, link) => {
        
        if (!this.index[i].img) {
            this.index[i].img = link;
            console.log(link);
        }
    }

    // Select indexed pokemon
    this.select = function(i) {
        if (i <= this.index.length) {

            this.indexCurrent = i; // Sets the current selection property.
            this.currentSelection = this.index[i];

            // this.setImg(i, link); // Set image

            return this.index[i]; // Returns the current selection.

        } else {

            console.log(`Enter value less than ${this.index.length}`);
        }
        
    }   

    // Select random pokemon
    this.selectRandom = function() {

        const rand = Math.floor(Math.random() * this.index.length); // Select random pokemon within range of available entries

        this.indexCurrent = rand; // Update current selection
        this.currentSelection = this.index[rand];

        // this.setImg(rand);

        return this.index[rand];
    }




}
