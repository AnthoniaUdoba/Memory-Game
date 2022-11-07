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
    //add classes open and show to the selected card
    handleClick.classList.add("open", "show");
    openedCards.push(handleClick);
  }
  if (openedCards.length === 2) {
    incrementMoveCount();
    if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
      matched();
    } else {
      openedCards[0].classList.add("unmatch");
      openedCards[1].classList.add("unmatch");
      setTimeout(notMatched, 300);
    }
  }
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

//function to change stare rating
// function starRating(moveCounter) {
//   if (moveCounter === 24 || moveCounter === 32) {
//     let star = document.querySelector(".fa-star");
//     //24 moves will reduce one star by deleteing the childNode of starsRating
//     star.remove();
//   }
// }

// Filled star icon
const $starFill = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`;
// Empty star icon
const $starEmpty = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg>
`;
// Ratings component
function starRating(moveCounter) {
  return `
        <div class='rating d-flex align-items-center justify-content-center'>
       
            <span>
                ${moveCounter > 24 ? $starFill : $starEmpty}
            </span>
            <span>
            ${moveCounter >= 19 ? $starFill : $starEmpty}
        </span>
            <span>
            ${moveCounter <= 18 ? $starFill : $starEmpty}
        </span>
        </div>
    `;
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
      modal.innerHTML = `<section class="score-panel"> <h1 class="you-won">Congratuations! You Completed the game!</h1> With
      ${moveCounter} moves, in ${timeCounter} seconds, and ${starRating(
        moveCounter
      )} star(s) <button class="congratsPlay"> Play Again<i class="fa fa-repeat"></i></button></section> `;
      modal.classList.add("show");
      const play = document.getElementsByClassName("congratsPlay");
      play[0].addEventListener("click", resetGame);
    }, 300);
    clearInterval(timer);
  }
}
