const palavraSecreta = document.querySelector('.palavra-secreta');
const categorys = document.querySelector('.categorys');
const refreshBtn = document.querySelector('.bx-refresh');
const imgForca = document.querySelector('.img-forca');
const teclas = document.querySelector('.teclas');
const gameOverCont = document.querySelector('.gameover');
const restartBtn = document.querySelector('.restart-btn');
const correctWord = document.querySelector('.right-word');

const pauseBtn = document.querySelector('.bx-pause-circle');
const appendBtn = document.querySelector('.bxs-plus-circle');
const startBtn = document.querySelector('.bxs-right-arrow');

const shaddowAppend = document.querySelector('.append-shaddow');
const exitBtn = document.querySelector('.bx-x');

const palavraInput = document.querySelector('#palavra-input');
const categoriaInput = document.querySelector('#categoria-input');
const addBtn = document.querySelector('.append-word');

const mode = document.querySelector('.mode');

async function queryRandom() {
    
    const response = await fetch('./assets/js/categorias.json');
    const json = await response.json();

    const random = Math.floor(Math.random() * json.length);

    return json[random]; 
}


function crateLetra(letra) {
    const div = document.createElement('div');
    div.innerText = letra;
    
    if(letra === ' ') {
        div.classList.add('empty-space');
    }else{
        div.classList.add('letra', 'letra-hidden');
    }

    palavraSecreta.appendChild(div)
}

let secretWord;

async function createSecretWord() {

    const json = await queryRandom();

    for(let categoria in json) {   

        const random = Math.floor(Math.random() * json[`${categoria}`].length);
        const palavra = json[`${categoria}`][random].toUpperCase();

        secretWord = palavra;

        categorys.innerText = categoria.toUpperCase();
        for(p of palavra) {
            crateLetra(p)
        }
    }


}
createSecretWord()

function lostGame() {
    gameOverCont.style.display = 'block';
    correctWord.innerHTML = secretWord;
}

const gameReinicialized = () => {
    pauseBtn.style.display = 'block';
    startBtn.style.display = 'none';
    appendBtn.style.display = 'none';
    imgForca.setAttribute('src', './assets/imgs/forca.png')
    gameOverCont.style.display = 'none';
    palavraSecreta.querySelectorAll('div').forEach(letra => letra.remove());
    teclas.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = 'green';
        btn.classList.remove('clicked');
    })
    erros = 0;

    mode.innerHTML = 'modo automático';

    createSecretWord();
}

function verifyWin() {
    let flag = true;
    const letras = document.querySelectorAll('.letra');

    letras.forEach(letra => {
        if(letra.classList.contains('letra-hidden')){
            flag = false;
        }
    })
    return flag;
}

// events 

// teclas buttons

let erros = 0;

teclas.querySelectorAll('button').forEach(btn => {

    btn.addEventListener('click', e => {

        if(btn.classList.contains('clicked')) return;

        let contains = false;
        palavraSecreta.querySelectorAll('.letra').forEach(letra => {
            if(btn.innerText === letra.innerText) {
                letra.classList.remove('letra-hidden');

                contains = true;
            }
        })

        if(verifyWin()) {
            alert('PARABÉNS VOCÊ ACHOU A PALAVRA ! '+ secretWord)
            return gameReinicialized();
        }

        if(!contains) {
            erros += 1;
            // aqui analiza se perdeu o jogo:
            imgForca.setAttribute('src', `./assets/imgs/forca0${erros}.png`)

            if(erros === 6) {
                lostGame()
            };

                btn.style.backgroundColor = 'red';
                btn.classList.add('clicked');
                return;
        }

        btn.style.backgroundColor = 'blue';
        btn.classList.add('clicked');
    }) 

})

restartBtn.addEventListener('click', gameReinicialized)

refreshBtn.addEventListener('click', gameReinicialized)

pauseBtn.addEventListener('click', e => {
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'block';
    appendBtn.style.display = 'block';
    mode.innerHTML = 'modo Manual';
    
})

appendBtn.addEventListener('click', () => {
    shaddowAppend.style.display = 'block';
});

addBtn.addEventListener('click', () => {
    imgForca.setAttribute('src', './assets/imgs/forca.png')
    gameOverCont.style.display = 'none';
    palavraSecreta.querySelectorAll('div').forEach(letra => letra.remove());
    teclas.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = 'green';
        btn.classList.remove('clicked');
    })
    erros = 0;

    for(l of palavraInput.value.toUpperCase()) {
        crateLetra(l)
    }
    
    secretWord = palavraInput.value

    categorys.innerText = categoriaInput.value.toUpperCase();
    shaddowAppend.style.display = 'none';
})

exitBtn.addEventListener('click', () => shaddowAppend.style.display = 'none');

startBtn.addEventListener('click',  gameReinicialized)
