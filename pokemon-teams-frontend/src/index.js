const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainEl = document.querySelector('main')

const getTrainers = () => {
    return fetch(TRAINERS_URL)
        .then(resp => resp.json())
}

const createCard = (trainer) => {
    var cardEl = document.createElement('div')
    cardEl.className = "card"
    cardEl.dataset.id = trainer.id

    const pokemonsHtml = trainer.pokemons.map(pokemon => 
        `<li id="list-${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>` 
    ).join('')



    cardEl.innerHTML = `<p>${trainer.name}</p>
       <button data-trainer-id="${trainer.id}">Add Pokemon</button>
       <ul>${pokemonsHtml}</ul>`
       
    const ulEl = cardEl.querySelector('ul')
    cardEl.querySelector('button').addEventListener('click', () => {
        createPokemon(trainer.id)
        .then(pokemon => {
            if (pokemon.error) return
            ulEl.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>` 
        })
    })

    mainEl.append(cardEl)
}

const addCards = (trainers) => {
    trainers.forEach(createCard)
}

const createPokemon = (trainer) => {
	return fetch(POKEMONS_URL,{
  		method:"POST",
  		headers: {
  			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
 		 	"trainer_id": trainer
		})
	}).then(resp => resp.json())
}

const removePokemonListener = () => {
    document.addEventListener('click', e => {
        if (e.target.classList.contains('release')){
            id = e.target.dataset.pokemonId
            fetch(POKEMONS_URL + `/${id}`,{
            method: "DELETE"
            }).then(resp => {	
            if (resp.error) return
            document.querySelector(`#list-${id}`).remove()
            })
        }
    })
}

const initialize = () => {
    getTrainers().then(addCards)
    removePokemonListener()
}



initialize()
