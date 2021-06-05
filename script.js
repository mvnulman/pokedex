const blueBtn = document.getElementById('blue-pill-button');
const redBtn = document.getElementById('red-pill-button');
const leftPad = document.getElementById('d-pad-left');
const rightPad = document.getElementById('d-pad-right');
const pokemonImg = document.getElementById('pokemon-picture');

const number = document.getElementById('number');
const name = document.getElementById('name');
const height = document.getElementById('height');
const weight = document.getElementById('weight');
const type = document.getElementById('type');
const image = document.getElementById("img");

let id = undefined;

const getData = async () => {
    id = Math.floor(Math.random() * 899)
    try {
        image.setAttribute('src', 'loading.gif')
        image.style.width = "100px";
        image.style.height = "100px";
        image.style.position = "relative";
        image.style.left = "20px";
        image.style.top = "20px";
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const res = await response.json();

        let content = document.getElementById('content');
        let contentImg = document.getElementById('content-img');

        image.setAttribute('src', `${res.sprites.front_default}`)
        image.style.maxHeight = "300px";
        image.style.width = "150px";

        contentImg.appendChild(image)
        
        name.textContent = `${res.name.toUpperCase()}`;
        number.textContent = `Pokemon N°${res.id}`
        height.textContent = `Height: ${res.height}`
        weight.textContent = `Weight: ${res.weight}`
        type.textContent = `Type: ${res.types[0].type.name}`
   

    } catch (e) {
        console.log(e)
    }
}

blueBtn.addEventListener('click', () => {
    getData();
})

redBtn.addEventListener('click', () => {
    window.location.reload();
})


leftPad.addEventListener('click', async () => {
    id--;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const res = await response.json();

        let content = document.getElementById('content');
        let contentImg = document.getElementById('content-img');

        image.setAttribute('src', `${res.sprites.front_default}`)
        contentImg.appendChild(image)

        name.textContent = `${res.name.toUpperCase()}`;
        number.textContent = `Pokemon N°${res.id}`
        height.textContent = `Height: ${res.height}`
        weight.textContent = `Weight: ${res.weight}`
        type.textContent = `Type: ${res.types[0].type.name}`

    } catch(error) {
        console.log('fetch error', error);
    }
})

rightPad.addEventListener('click', async () => {
    id++;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const res = await response.json();

        let content = document.getElementById('content');
        let contentImg = document.getElementById('content-img');

        image.setAttribute('src', `${res.sprites.front_default}`)
        contentImg.appendChild(image)

        name.textContent = `${res.name.toUpperCase()}`;
        number.textContent = `Pokemon N°${res.id}`
        height.textContent = `Height: ${res.height}`
        weight.textContent = `Weight: ${res.weight}`
        type.textContent = `Type: ${res.types[0].type.name}`

    } catch(error) {
        console.log('fetch error', error);
    }
})