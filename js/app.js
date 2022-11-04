let deck = document.querySelector(".deck");
let moves = document.querySelector(".moves");
let seconds = document.querySelector(".timer");
let stars = document.querySelector(".stars");
let allCards = document.querySelectorAll("li.card");
let refreshButton = document.querySelector(".restart");
let scorePanel = document.querySelector(".score-panel");
let modal = document.querySelector(".modal");
let moveCounter = 0;
let timeCounter = 0;
let timer;
let openedCards = [];
let matchedCards = 0;

/*
 * Create a list that holds all of your cards
 */

let icons = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb",
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffleCards();

function shuffleCards() {
  let cardsArray = [...allCards];
  let shuffleCards = shuffle(cardsArray);
  for (let shuffleCard of shuffleCards) {
    deck.appendChild(shuffleCard);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function cardClick(clickedCard) {
  let handleClick = clickedCard.target;
  // to make sure that the clicked target is a card &
  // not an opened/matched card
  if (
    handleClick.classList.contains("card") &&
    !handleClick.classList.contains("open", "show", "match")
  ) {
    incrementMoveCount();
    storeCard(clickedCard);
    //add classes open and show to the selected card
    handleClick.classList.add("open", "show");
    if (openedCards.length === 2) {
      if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
        matched();
      } else {
        openedCards[0].classList.add("unmatch");
        openedCards[1].classList.add("unmatch");
        setTimeout(notMatched, 300);
      }
    }
  }
}
function storeCard(thisCard) {
  openedCards.push(thisCard.target);
}

deck.addEventListener("click", cardClick);

//function to start timer when the first card is clicked
function startTimer(clickedCard) {
  if (clickedCard.target.className !== "deck") {
    deck.removeEventListener("click", startTimer);
    timer = setInterval(time, 1000);
  }
}

function time() {
  timeCounter += 1;
  seconds.innerHTML = timeCounter + " s";
}

deck.addEventListener("click", startTimer);

//function to increase move count
function incrementMoveCount() {
  moveCounter += 1;
  moves.innerHTML = moveCounter;
  starRating(moveCounter);
}

//function to change star rating
function starRating(moveCounter) {
  if (moveCounter === 24 || moveCounter === 32) {
    let star = document.querySelector(".fa-star");
    star.remove();
  }
}

//function to check if cards match
function matched() {
  openedCards[0].classList.add("match");
  openedCards[1].classList.add("match");
  openedCards = [];
  showResult();
}

//function to check if cards do not match
function notMatched() {
  openedCards[0].classList.remove("unmatch");
  openedCards[1].classList.remove("unmatch");
  openedCards[0].classList.remove("open", "show");
  openedCards[1].classList.remove("open", "show");
  openedCards = [];
}

//restart game and scores
refreshButton.addEventListener("click", resetGame);

function resetGame() {
  shuffleCards();
  matchedCards = 0;
  openedCards = [];
  moveCounter = 0;
  moves.innerHTML = moveCounter;
  timeCounter = 0;
  clearInterval(timer);
  seconds.innerHTML = timeCounter + " s";
  stars.innerHTML =
    '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
  deck.addEventListener("click", startTimer);
  clearAll();
  modal.className = "modal";
}
refreshButton.addEventListener("click", resetGame);

//function to flip card face down when refreshed
function clearAll() {
  matchedCards = [];
  const cardsArray = [...allCards];
  for (let card of cardsArray) {
    card.className = "card";
  }
}

// function to open modal when all cards are matched
function showResult() {
  let ratings = stars.innerHTML;
  matchedCards += 2;
  if (matchedCards == 16) {
    setTimeout(function () {
      modal.innerHTML = `<section class="score-panel"> <h1 class="you-won">YAAAAAAY! YOU WON!</h1> With
        ${moveCounter} moves, in ${timeCounter} seconds, and ${ratings} star(s) </section> <button class="congratsPlay"> Play Again<i class="fa fa-repeat"></i></button>`;
      modal.classList.add("show");
      const play = document.getElementsByClassName("congratsPlay");
      play[0].addEventListener("click", resetGame);
    }, 300);
    clearInterval(timer);
  }
}
