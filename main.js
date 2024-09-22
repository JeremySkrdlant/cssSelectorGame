//Global Variables
let cssInput = document.getElementById("cssInput");
let gameArea = document.getElementById("gameArea");
let gameSpeed = 2000; 
let score = 0; 
var gameClock; 

 

//----------------------------------------------------------
//
//  RANDOM TAG GENERATOR AREA 
//
//----------------------------------------------------------
function addGameTag(innerText, dataKey){
    let newTag = document.createElement("div"); 
    newTag.classList.add("dropTag"); 
    newTag.innerHTML = `&lt; ${innerText} &gt;`;
    newTag.dataset.key = dataKey;

    //generate random left to right position
    let max = window.innerWidth - (dataKey.length * 9) - 80; 
    let leftPosition = Math.floor(Math.random() * max); 
    newTag.style.left = leftPosition + "px"; 
    newTag.style.top = "10px";

    gameArea.appendChild(newTag); 
}

function generateRandomClassCode(){
    //use a generator in the future on this. 
    let possibleClassNames = ["cat", "dog", "card", "hidden", "shown", "highlighted", "bird", "plane", "fluffy", "coffee", "pop", "phone", "email", "profile", "tool"]
    let randomChoice = Math.floor(Math.random() * possibleClassNames.length); 
    let chosen = possibleClassNames[randomChoice]; 
    addGameTag(`<span class="light">... </span> class="${chosen}"`, `.${chosen}`)

}

function generateRandomTagCode(){
    let possibleTags = ["body", "div", "section", "ul", "li", "ol", "h1", "h2", "h3", "img", "p", "header", "footer", "table", "tr", "td"]; 
    let randomChoice = Math.floor(Math.random() * possibleTags.length); 
    let chosen = possibleTags[randomChoice];
    addGameTag(chosen, chosen)

}

function generateRandomIDCode(){
    let possibleIDs = ["character", "gameArea", "cssInput", "first", "main", "test", "resultArea", "pageSubmit", "bobRoss", "southwest", "agreement", "disclaimer"]; 
    let randomChoice = Math.floor(Math.random() * possibleIDs.length); 
    let chosen = possibleIDs[randomChoice];
    addGameTag(`...  id="${chosen}"  ...`, `#${chosen}`); 
}

function addNextItem(){
    //start with simple tags
    if (score < 5){
        generateRandomTagCode();
        return;
    }

    //move to classes
    if (score < 10){
        generateRandomClassCode();
        return;
    }

    //move to ids
    if (score < 15){
        generateRandomIDCode();
        return;
    }

    //random choice and increase speed every 20; 

    if(score % 20 == 0){
        gameSpeed -= 400; 
    }

    let choice = Math.floor(Math.random() * 3);
    switch (choice){
        case 0: 
            generateRandomTagCode();
            break;
        case 1:
            generateRandomClassCode();
            break;
        case 2:
            generateRandomIDCode();
            break;
    }
}

//----------------------------------------------------------
//
//   GAME LOOP
//
//----------------------------------------------------------
  

function startGame(){
    document.getElementById("beginGameSound").play();
    cssInput.classList.remove("hidden");
    cssInput.focus();
    gameArea.innerHTML = "";
    addNextItem();
    setClock(); 
}

function updateGameField(){
    let allTags = gameArea.childNodes; 
    let gameOverZone = parseInt(window.innerHeight) - 65; 

    allTags.forEach((tag)=>{
        if(tag.style){
            let previousTop = parseInt(tag.style.top); 
            previousTop += 35; 
            if(previousTop > gameOverZone){
                endGame();
            }
            tag.style.top = `${previousTop}px`;
        }   
        
    })
}

function endGame(){
    clearInterval(gameClock); 
    gameClock = null;
    document.getElementById("gameOverSound").play();
    alert(`You got ${score} points`)
    gameArea.innerHTML = "";
    score = 0;
    cssInput.value = "";
    setTimeout(()=>{
        setClock();
    }, 300)
}

function setClock(){
    if(gameClock){
        clearInterval(gameClock);
        gameClock = null;
    }
    gameClock = setInterval(()=>{
        addNextItem()
        updateGameField()
    }, gameSpeed)
}

//----------------------------------------------------------
//
//   USER INPUT
//
//----------------------------------------------------------
function zapItems(){
    let currentSelector = cssInput.value;
    let correctCount = 0; 
    let allTags = gameArea.childNodes; 
    
    //Go in reverse to prevent not removing the next item in the array. 
    for(var i = allTags.length - 1; i >= 0; i-- ){
        var tag = allTags[i];
        if (tag.dataset){
            if (tag.dataset.key == currentSelector){
                correctCount++; 
                tag.remove();
            }
        }
    }
    
    if (correctCount == 0){
        //User did not type in the correct selector
        document.getElementById("incorrectSound").play();
    }else {
        document.getElementById("correctSound").play();
    }

    score += correctCount; 
    cssInput.value = "";
}



 
