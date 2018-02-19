var express = require('express');
var router = express.Router();

var words = [];
var word = "";
var underscores = [];
var guessesArray = [];
var incorrectLetters = [];
var highScore = 3;
var guessLimit = 5;
var guessCount = 0;
var scoreHistory = [];
var gameStatus = "";
var endOfGame = false;

/* GET the main page */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Hangman', word: word, underscores: underscores, guessLimit: guessLimit,
        gameStatus: gameStatus, endOfGame: endOfGame, scoreHistory: scoreHistory, highScore: highScore,
        guessCount: guessCount, incorrectLetters: incorrectLetters, guessLimit: guessLimit
    });
});


/* POST new game req */
router.post('/newGame', function (req, res, next) {
    game.refreshApp();
    res.redirect('/');
})

/* POST guess req */
router.post('/guess', function (req, res, next) {
    sess = req.session;
    sess.guess = req.body.guess;
    game.validateLetter(sess.guess, res);
    res.redirect('/');
});

/* POST highScore req */
router.post('/highScore', function (req, res, next) {
    name = req.body.player;
    game.addHighScore(name, guessCount);
    res.redirect('/');
});

/*
 *   Start the game, set the words array and select at random a word from the array
 */

var game = {

    startGame: function () {
        // set array of words
        words = ["spatula", "amsterdam", "print", "eggs", "red"];
        // select at random word from array
        word = words[Math.floor(Math.random() * words.length)];
        // display underscores for selected word
        for (i = 0; i < word.length; i++) {
            underscores.push("_");
        }
        game.addMockUsers();
    },


    /*
     * Check guess against selected word
     */

    validateLetter: function (letter, res) {
        var valid = false, i;

        // check if letter has already been guessed
        for (var i = 0; i < guessesArray.length; i++) {
            if (guessesArray[i].indexOf(letter) > -1) {
                gameStatus = "You have already guessed that letter - please try again";
                var present = true;
                guessLimit--;
                guessCount++;
            }
        }

        // check if selected word contains letter
        if (word.indexOf(letter) > -1 && !present) {

            guessesArray.push(letter);

            for (i = 0; i < word.length; i++) {
                if (word[i] === letter) {
                    valid = true;
                    underscores[i] = letter.toString();
                }
            }

        }

        // if underscores has been completed and guessArray length matches, game won
        if (guessesArray.length === underscores.length) {
            gameStatus = "Correct you win! Your score: " + guessCount;
            endOfGame = true;
        }
        if (!valid) {
            guessCount++;
            guessLimit--;
            incorrectLetters.push(letter);
            gameStatus = "Incorrect letter - please guess again";
        }
        if (!valid && guessLimit === 0) {
            gameStatus = "Game over!";
        }

    },


    /*
     *   Adds a few mock players and high scores to the scoreHistory array
     */

    addMockUsers: function () {
        scoreHistory = [
            {name: 'George', score: 3},
            {name: 'Henry', score: 5},
            {name: 'Sarah', score: 4},
            {name: 'Emma', score: 3}
        ]
    },


    /*
     *    Adds the players name and score to the array if they win and >= highScore
     */

    addHighScore: function (player, score) {
        if (score <= highScore) {
            gameStatus = "You have a new high score!";
            scoreHistory.push({name: player, score: score});
            game.refreshApp();
        }
    },

    /*
     *  Refreshes vars to start a new game
     */

    refreshApp: function () {
        endOfGame = false;
        guessLimit = 5;
        guessCount = 0;
        underscores = [];
        guessesArray = [];
        incorrectLetters = [];
        gameStatus = "";
        game.startGame();
    }

}

game.startGame();
module.exports = router;


