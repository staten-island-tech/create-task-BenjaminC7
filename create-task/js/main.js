import "../styles/style.css";
let DOM = {
  startButton: document.getElementById("startButton"),
  buttonHolder: document.getElementById("buttonHolder"),
  playerHand: document.getElementById("playerHand"),
  dealerHand: document.getElementById("dealerHand"),
  playerCards: document.getElementById("playerCards"),
  dealerCards: document.getElementById("dealerCards"),
  playerTotal: document.getElementById("playerTotal"),
  dealerTotal: document.getElementById("dealerTotal"),
  endText: document.getElementById("endText"),
};
async function startDeck() {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  );
  const deck = await response.json();
  return deck.deck_id;
}
function addCard(draw, playerValue) {
  console.log(draw.value);
  if (draw.value == "2") {
    playerValue = playerValue + 2;
  } else if (draw.value == "3") {
    playerValue = playerValue + 3;
  } else if (draw.value == "4") {
    playerValue = playerValue + 4;
  } else if (draw.value == "5") {
    playerValue = playerValue + 5;
  } else if (draw.value == "6") {
    playerValue = playerValue + 6;
  } else if (draw.value == "7") {
    playerValue = playerValue + 7;
  } else if (draw.value == "8") {
    playerValue = playerValue + 8;
  } else if (draw.value == "9") {
    playerValue = playerValue + 9;
  } else if (draw.value == "10") {
    playerValue = playerValue + 10;
  } else if (draw.value == "KING") {
    playerValue = playerValue + 10;
  } else if (draw.value == "JACK") {
    playerValue = playerValue + 10;
  } else if (draw.value == "QUEEN") {
    playerValue = playerValue + 10;
  } else if (draw.value == "ACE") {
    if (playerValue <= 10) {
      playerValue = playerValue + 11;
    } else {
      playerValue = playerValue + 1;
    }
  } else {
    console.log("Draw error.");
  }
  return playerValue;
}
async function openingDraw(deckId) {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  const draws = await response.json();
  let playerValue = 0;
  draws.cards.forEach((draw) => {
    playerValue = addCard(draw, playerValue);
    DOM.playerCards.insertAdjacentHTML(
      "afterbegin",
      `<img src="${draw.image}" alt="${draw.value} of ${draw.suit}">`
    );
  });
  return playerValue;
}
async function startGame() {
  const deckId = await startDeck();
  let playerValue = await openingDraw(deckId);
  console.log(playerValue);
  DOM.playerTotal.innerHTML = `Player Total: ${playerValue}`;
  let data = {
    playerValue: playerValue,
    deckId: deckId,
  };
  return data;
}
DOM.startButton.addEventListener("click", async function () {
  DOM.playerCards.innerHTML = "";
  DOM.dealerCards.innerHTML = "";
  DOM.dealerTotal.innerHTML = "Dealer Total: 0";
  DOM.endText.innerHTML = "";
  DOM.startButton.style.display = "none";
  let data = await startGame();
  if (data.playerValue == 21) {
    console.log("You got a natural, you win!");
    DOM.endText.innerHTML = "You got a natural, you win!";
    DOM.startButton.style.display = "initial";
    return;
  }
  DOM.buttonHolder.insertAdjacentHTML(
    "afterbegin",
    `<button class="button" id="hitButton">Hit</button>
    <button class="button" id="standButton">Stand</button>`
  );
  const hitButton = document.getElementById("hitButton");
  const standButton = document.getElementById("standButton");
  hitButton.addEventListener("click", async function () {
    let playerValue = data.playerValue;
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${data.deckId}/draw/?count=1`
    );
    const draws = await response.json();
    draws.cards.forEach((draw) => {
      playerValue = addCard(draw, playerValue);
      DOM.playerCards.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draw.image}" alt="${draw.value} of ${draw.suit}">`
      );
    });
    console.log(playerValue);
    DOM.playerTotal.innerHTML = `Player Total: ${playerValue}`;
    if (playerValue > 21) {
      console.log("You bust...");
      DOM.endText.innerHTML = "You bust...";
      hitButton.remove();
      standButton.remove();
      DOM.startButton.style.display = "initial";
    } else {
      data.playerValue = playerValue;
      return data;
    }
  });
  standButton.addEventListener("click", async function () {
    hitButton.remove();
    standButton.remove();
    console.log("Dealer goes");
    let dealerValue = 0;
    while (dealerValue < 17) {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${data.deckId}/draw/?count=1`
      );
      const draws = await response.json();
      draws.cards.forEach((draw) => {
        dealerValue = addCard(draw, dealerValue);
        console.log(dealerValue);
        DOM.dealerTotal.innerHTML = `Dealer Total: ${dealerValue}`;
        DOM.dealerCards.insertAdjacentHTML(
          "afterbegin",
          `<img src="${draw.image}" alt="${draw.value} of ${draw.suit}">`
        );
      });
    }
    if (dealerValue > 21) {
      console.log("Dealer busts, you win!");
      DOM.endText.innerHTML = "Dealer busts, you win!";
      DOM.startButton.style.display = "initial";
    } else if (dealerValue > data.playerValue) {
      console.log("The dealer's total is higher, you lose...");
      DOM.endText.innerHTML = "The dealer's total is higher, you lose...";
      DOM.startButton.style.display = "initial";
    } else if (data.playerValue > dealerValue) {
      console.log("Your total is higher than the dealer's total, you win!");
      DOM.endText.innerHTML =
        "Your total is higher than the dealer's total, you win!";
      DOM.startButton.style.display = "initial";
    } else if (data.playerValue == dealerValue) {
      DOM.endText.innerHTML = "It's a tie.";
      DOM.startButton.style.display = "initial";
    } else {
      console.log("Ending error");
      DOM.startButton.style.display = "initial";
    }
  });
});
