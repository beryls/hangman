var word = {
  secretWord: "",
  wordList: ['ruby', 'rails', 'javascript', 'array', 'hash', 'underscore', 'sinatra', 'model', 'controller', 'view', 'devise', 'authentication', 'capybara', 'jasmine', 'cache', 'sublime', 'terminal', 'system', 'twitter', 'facebook', 'function', 'google', 'amazon', 'development', 'data', 'design', 'inheritance', 'prototype', 'gist', 'github', 'agile', 'fizzbuzz', 'route', 'gem', 'deployment', 'database'],

  // Selects a random word from the word list sets the secret word
  setSecretWord: function() {
    this.secretWord = this.wordList[_.random(0, this.wordList.length - 1)];
  },

  // Takes an array of letters as input and returns an array of two items:
  // 1) A string with the parts of the secret word that have been guessed correctly and underscore for the parts that haven't
  // 2) An array of all the guessed letters that were not in the secret word
  checkLetters: function(guessedLetters){
    var correctLetters = _.intersection(this.secretWord, guessedLetters);
    var wrongLetters = _.difference(guessedLetters, correctLetters);
    var wordDisplay = [];
    _.each(this.secretWord, function(letter){
      if (_.contains(correctLetters, letter)) {
        wordDisplay += letter;
      } else {
        wordDisplay += "_";
      }
    });
    return [wordDisplay, wrongLetters];
  }
};

var player = {
  MAX_GUESSES: 8,
  guessedLetters: [],

  // Takes a new letter as input and updates the game
  makeGuess: function(letter){
    this.guessedLetters += (letter);
    var results = word.checkLetters(this.guessedLetters);
    game.updateDisplay(results[0], this.guessedLetters, this.MAX_GUESSES-results[1].length);
    if (this.checkWin(results[0])) {
      alert("You win! You correctly guessed " + word.secretWord);
      game.resetGame();
    }
    if (this.checkLose(results[1])) {
      game.giveUp();
    }
  },

  // Check if the player has won and end the game if so
  checkWin: function(wordString){
    if (_.contains(wordString, "_")) {
      return false;
    } else {
      return true;
    }
  },

  // Check if the player has lost and end the game if so
  checkLose: function(wrongLetters){
    return wrongLetters.length >= this.MAX_GUESSES;
  }
};

var game = {
  // Resets the game
  resetGame: function(){
    word.setSecretWord();
    player.guessedLetters = [];
    var wordDisplay = "";
    _.each(word.secretWord, function(letter){
        wordDisplay += "_";
    });
    game.updateDisplay(wordDisplay, player.guessedLetters, player.MAX_GUESSES);
  },

  // Reveals the answer to the secret word and ends the game
  giveUp: function(){
    alert("You lose!  The answer was " + word.secretWord);
    this.resetGame();
  },

  // Update the display with the parts of the secret word guessed, the letters guessed, and the guesses remaining
  updateDisplay: function(secretWordWithBlanks, guessedLetters, guessesLeft){
    document.getElementById("wordString").innerText = secretWordWithBlanks;
    document.getElementById("guessedLetters").innerText = guessedLetters;
    document.getElementById("guessesLeft").innerText = guessesLeft;
  }
};

window.onload = function(){
  // Start a new game
  // Add event listener to the letter input field to grab letters that are guessed
  // Add event listener to the reset button to reset the game when clicked
  // Add event listener to the give up button to give up when clicked

  game.resetGame();
  console.log(word.secretWord);
  // debugger;

  var surrender = document.getElementById("giveUpButton");
  var reset = document.getElementById("resetButton");
  var guess = document.getElementById("letterField");

  surrender.onclick = function(event) {
    game.giveUp();
  }

  reset.onclick = function(event) {
    game.resetGame();
  }

  guess.onchange = function(event) {
    var currentLetter = guess.value.toLowerCase();
    var singleLetter = /^[a-z]$/;
    if (singleLetter.test(currentLetter)) {
      if (_.contains(player.guessedLetters, currentLetter)) {
        alert("You've already guessed this letter.");
        alert("And yeah, we're being kind. We could have just counted this as a wrong letter, you know.");
      } else {
        player.makeGuess(currentLetter);
      }
    } else {
      alert("We need a single letter, from a to z. Try that again.");
    }
    guess.value = "";
  }
};