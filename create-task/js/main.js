import "../styles/style.css";
import { DOM } from "./DOM";
async function startDeck() {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  );
  const deck = await response.json();
  return deck.deck_id;
}
async function openingDraw(deckId) {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  const draws = await response.json();
  let playerValue = 0;
  draws.cards.forEach((draw) => {
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
      playerValue = playerValue++ + 10;
    } else if (draw.value == "QUEEN") {
      playerValue = playerValue + 10;
    } else if (draw.value == "ACE") {
      if (playerValue <= 10) {
        playerValue = playerValue + 11;
      } else {
        playerValue = playerValue + 1;
      }
    } else {
      console.log("Draw Error.");
    }
  });
  return playerValue;
}
async function startGame() {
  const deckId = await startDeck();
  let playerValue = await openingDraw(deckId);
  console.log(playerValue);
  return playerValue;
}
DOM.startButton.addEventListener("click", function () {
  startGame();
});
