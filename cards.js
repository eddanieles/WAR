//Let's play cards

var Card = function(numericalValue, suit) {
  this.suit = suit;
  this.numericalValue = numericalValue;
  if (numericalValue < 11) {
    this.faceValue = numericalValue;
  } else {
    var faceCards = {
      11: "Jack",
      12: "Oueen",
      13: "King",
      14: "Ace"
    }
    this.faceValue = faceCards[numericalValue];
  }

}

var kingOfDiamonds = new Card("diamonds", "king");
var threeOfClubs = new Card("clubs", 3);
var aceOfHearts = new Card("hearts", "ace");
var aceOfSpades = new Card("spades", "ace");

//I'd like to display these cards like so:
//"king of diamons" or "3 of clubs"

Card.prototype.display = function() {
  return `${this.value} of ${this.suit}`
}

//I'd like to be able to compare two cards
//kingofDiamonds.beats(threeOfClubs) //true
//threeOfClubs.beats(kingofDiamonds) //false

Card.prototype.beats = function(otherCard) {
  return this.numericalValue > otherCard.numericalValue
}


function Deck() {
  this.cards = [];
  for (var val = 2; val <= 14; val++){
    ["clubs", "diamonds", "hearts", "spades"].forEach(
      (suit) => this.cards.push(new Card(val, suit))
    );

  }
  function shuffle(cards) {
      var j, x, i;
      for (i = cards.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = cards[i - 1];
          cards[i - 1] = cards[j];
          cards[j] = x;
      }
  }
  shuffle(this.cards);
}

function Player(name, cards) {
  this.name = name;
  this.hand = cards;
}
Player.prototype.presentCard = function(){
  return this.hand.shift();
}
Player.prototype.take = function(cardOne, cardTwo){
  this.hand.push(cardOne);
  this.hand.push(cardTwo);
}

function Game(playerOne, playerTwo){
  var deck = new Deck;
  var fristHand  = deck.cards.splice(0, 26);
  var secondHand  = deck.cards;
  this.players = [new Player(playerOne, fristHand), new Player(playerTwo, secondHand)];
  this.playerOne = this.players[0];
  this.playerTwo = this.players[1];
}

var tieArray = [];

Game.prototype.tieFunction = function(cardOne, cardTwo) {
  console.log("There is a tie!");

  tieArray.push(cardOne);
  tieArray.push(cardTwo);

  if (this.playerOne.hand.length < 4 || this.playerTwo.hand.length < 4){
    this.playerOne.hand.splice(0, this.playerOne.hand.length - 1).forEach(
      (card) => tieArray.push(card)
    );
    this.playerTwo.hand.splice(0, this.playerTwo.hand.length - 1).forEach(
      (card) => tieArray.push(card)
    );
  } else {
    this.playerOne.hand.splice(0, 3).forEach(
      (card) => tieArray.push(card)
    );
    this.playerTwo.hand.splice(0, 3).forEach(
      (card) => tieArray.push(card)
    );
  }

  this.battle();
}

Game.prototype.battle = function(){
  var firstPlayersCard = this.playerOne.presentCard();
  console.log(firstPlayersCard);
  var secondPlayersCard = this.playerTwo.presentCard();
  console.log(secondPlayersCard);

  if (firstPlayersCard.beats(secondPlayersCard)){
    console.log(`${this.playerOne.name} wins the battle!`);
    this.playerOne.take(firstPlayersCard, secondPlayersCard);
    tieArray.forEach(
      (card) => this.playerOne.hand.push(card)
    );
    tieArray = [];
  } else if (secondPlayersCard.beats(firstPlayersCard)){
    console.log(`${this.playerTwo.name} wins the battle!`);
    this.playerTwo.take(firstPlayersCard, secondPlayersCard);
    tieArray.forEach(
      (card) => this.playerTwo.hand.push(card)
    );
    tieArray = [];
  } else {
    this.tieFunction(firstPlayersCard, secondPlayersCard);

  }
  console.log(this.status());
  this.checkForWinner();
}

Game.prototype.checkForWinner = function() {
  if (this.playerOne.hand.length === 0) {
    this.winner = this.playerTwo;
  } else if (this.playerTwo.hand.length === 0) {
    this.winner = this.playerOne;
  }
  if(this.winner){
    console.log(`Game over! ${this.winner.name} wins!`);
    this.over = true;
  }
}

Game.prototype.status = function(){
  return `${this.playerOne.name} has ${this.playerOne.hand.length} cards remainings;
  ${this.playerTwo.name} has ${this.playerTwo.hand.length} cards`
}

var game = new Game("Ruth", "Ed");
while(!game.over){
  game.battle();
}
