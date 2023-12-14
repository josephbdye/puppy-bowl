const COHORT = "2309-AM";
const API = "https://fsa-puppy-bowl.herokuapp.com/api/" + COHORT;

const state = {
  players: [],
  selectedPlayer: null,
};

const getPlayers = async () => {
  try {
    const response = await fetch(API + "/players");
    const json = await response.json();
    state.players = Array.isArray(json.data.players) ? json.data.players : [];
  } catch (error) {
    console.error(error);
  }
};

const renderPlayers = async () => {
  await getPlayers();
  const $players = document.querySelector("ul.players");
  const $playerListItems = state.players.map((player) => {
    const li = document.createElement("li");
    li.innerHTML = `<h2>${player.name}</h2>`;
    li.addEventListener("click", () => {
      state.selectedPlayer = player;
      render();
      window.location.hash = player.id;
    });
    
    return li;
  });
  $players.replaceChildren(...$playerListItems);
};

const renderPlayer = () => {
  const $players = document.querySelector("ul.players");
  $players.innerHTML = `
    <li>
      <h2>${state.selectedPlayer.name}</h2>
      <img src="${state.selectedPlayer.imageUrl}">
      <p>${state.selectedPlayer.breed}</p>
    </li>
  `;
  $players.querySelector("li").addEventListener("click", () => {
    state.selectedPlayer = null;
    render();
    window.location.hash = "";
  });
};

const render = () => {
  if (!state.selectedPlayer) {
    renderPlayers();
  } else {
    renderPlayer();
  }
};

const loadPlayerFromHash = async () => {
  if (state.players.length === 0) {
    await getPlayers();
  }
  const idFromHash = +window.location.hash.slice(1);
  state.selectedPlayer = state.players.find(
    (player) => player.id === idFromHash
  );
  render();
};

window.addEventListener("hashchange", loadPlayerFromHash);

const init = async () => {
  await loadPlayerFromHash();
};

init();