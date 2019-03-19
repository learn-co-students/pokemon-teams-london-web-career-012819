const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const mainEl = document.querySelector('main')

function getTrainers() {
  return fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(trainers => addTrainers(trainers))
}

function addTrainer(trainer) {
  const cardEl = document.createElement('div')
  cardEl.className = 'card'
  cardEl.dataset.id = trainer.id
  cardEl.innerHTML = `
          <p>${trainer.name}</p>
          <button class="poke-poke" data-trainer-id="${trainer.id}">Add Pokemon</button>`

  const pokeUl = document.createElement('ul')
  const pokemonList = trainer.pokemons.map(pokemon => `<li id="list-${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`).join('')

  pokeUl.innerHTML = pokemonList
  cardEl.appendChild(pokeUl)
  mainEl.appendChild(cardEl)
}

function addTrainers(trainers) {
  trainers.forEach(trainer => addTrainer(trainer))
}

function deletePokemon(id) {
  const url = POKEMONS_URL +`/${id}`
  fetch(url, {
    method: 'DELETE'
  }).then(resp => {
    if (resp.error) return
    document.getElementById(`list-${id}`).remove()})
}

function releaseButton() {
  document.addEventListener('click', event => {
    if (event.target.className === "release") {
      deletePokemon(event.target.dataset.pokemonId)
    }
  })
}

function addPokemon(id) {

  const cardCollection = document.getElementsByClassName('card')
  const url = POKEMONS_URL
  const body = {"trainer_id": id}
  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(resp => resp.json())
}

function addingButton() {
  // btn = document.getElementById('button')
  document.addEventListener('click', event => {
    if (event.target.className === 'poke-poke') {
      const id = event.target.dataset.trainerId
        addPokemon(id).then(pokemon => {
          event.target.parentElement.querySelector('ul').innerHTML += `<li id="list-${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
        })
    }
  })
}

function initialize() {
  getTrainers()
  releaseButton()
  addingButton()
}

initialize()
