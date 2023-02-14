import "../styles/style.css";
import { DOM } from "./DOM";

async function startDeck() {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  );
  const deck = await response.json();
  console.log(deck.success);
  return deck.deck_id;
}
async function openingDraw(deckId) {
  let playerValue = 0;
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  );
  const draws = await response.json();
  draws.cards.forEach((draw) => {
    if ((draw.value = "1")) {
    }
  });
  return playerValue;
}

function startGame() {
  startDeck().then((value) =>
    openingDraw(value).then((value) => console.log(value))
  );
}
startGame();
