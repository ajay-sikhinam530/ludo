let triangles = document.querySelectorAll(".triangle");
var colors = ["green","orange","blue","yellow","purple","red"];
let colorItarator =0;
var activePlayers = ["green","orange","blue","yellow","purple","red"];
const rollButton = document.getElementById("roll-btn");
var currentPlayer = document.getElementById("current-player").innerText;
var currentRollValue = document.getElementById("roll-value").innerText;
var safePoints = ["3-1","2-3"];
const place = 0


triangles.forEach(triangle=>{
    let rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    let bigTriangle = document.createElement("div");
    bigTriangle.classList.add("big-triangle");
    let homeTriangle = document.createElement("div");
    homeTriangle.classList.add("home-triangle");
    let centerTriangle = document.createElement("div");
    centerTriangle.classList.add("center");


    bigTriangle.classList.add(colors[colorItarator])
    bigTriangle.style.borderTopColor = colors[colorItarator];
    triangle.style.borderTopColor = colors[colorItarator];


    for(let i =1;i<=4;i++){
        let circle = document.createElement("div");
        let className = "circle-"+i;
        circle.id = colors[colorItarator]+"-"+className;
        circle.classList.add(className);
        circle.style.background = colors[colorItarator];
        homeTriangle.appendChild(circle);
    }


    colorItarator++;


    rectangle.appendChild(bigTriangle);
    rectangle.appendChild(homeTriangle);
    triangle.appendChild(centerTriangle)
    triangle.appendChild(rectangle);
})


colorItarator = 0;
var rectangles = document.querySelectorAll(".rectangle");
rectangles.forEach(rectangle=>{
    presentColor = colors[colorItarator]
    for(let row =1; row<=6; row++){
        for(let col =1; col<=3; col++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = colors[colorItarator]+"-"+row+"-"+col;
            if(col==2 && row!=1 || col==3 &&row==2){
                cell.style.background = presentColor;
            }
            rectangle.appendChild(cell);
        }
    }
    colorItarator++;
})


function resetGame(){
    location.reload();
}


//Function to move a coin from one cell to the other
function moveCoin(curCellId,pawn, n){
    let i = 1
    console.log("->cur",curCellId)
    let s = setInterval(() => {
        doThis();
    }, 300);
    function doThis(){
        
        let nextCellId = getNextCell(curCellId,pawn);
        console.log("cur,pawn->",document.getElementById(curCellId),pawn);
        document.getElementById(curCellId).removeChild(pawn);
        if (!nextCellId){
            console.log("Final cell");
            clearInterval(s);
            return;
        }
        if(i==n){
            let finalCellId = nextCellId;
            let finalCell = document.getElementById(finalCellId);
            if(finalCell.hasChildNodes()){
                let killedPawn = finalCell.childNodes[0];
                if(killedPawn.id.slice(0,killedPawn.id.length-7)!=pawn.id.slice(0,pawn.id.length-7)){
                    if(!(finalCellId.includes("3-1") || finalCellId.includes("2-3"))){
                        finalCell.removeChild(killedPawn);
                        killCoin(killedPawn);
                    }
                    
                }
                
            }
            
            clearInterval(s);
        }
        document.getElementById(nextCellId).appendChild(pawn);
        console.log(nextCellId);
        curCellId = nextCellId
        
        i++;
    }
}

function makeHome(pawn){
    console.log("making Home");
    let pawnColor = pawn.id.slice(0,pawn.id.length-7);
    let currPlayer;
    activePlayerObjects.forEach(player => {
        if(player.name == pawnColor){
            currPlayer = player;
        }
    });
    currPlayer.homeReached +=1;
    document.getElementById(`${pawnColor}-icon-${currPlayer.homeReached}`).style.opacity = "1";
    if(currPlayer.homeReached==4){
        document.querySelector(`#${pawnColor}-tag`).innerText = `${pawnColor.toUpperCase()}-${place+1}`;
        activePlayers.splice(activePlayers.indexOf(pawnColor),1);
        console.log(activePlayers);
    }
    if (place==5){
        rollButton.disabled = true;
    }

}


function getNextCell(curCellId,pawn){
    let col = parseInt(curCellId[curCellId.length-1]);
    let row = parseInt(curCellId[curCellId.length-3]);
    let block = curCellId.slice(0,curCellId.length-4);
    console.log(pawn,typeof(pawn));
    let pawnColor = pawn.id.slice(0,pawn.id.length-7);
    if(row==6 && col ==2){
        console.log("going home");
        makeHome(pawn);
        return 0;
    }
    if(col==1 && row!=1){
        col = col;
        row -=1;
    }
    else if(col==3 && row!=6){
        col = col;
        row+=1;
    }
    else if(row==1 && col==1){
        row=1;
        col=2;
    }
    else if(row==6 && col==3){
        row = 6
        col = 1
        block = colors[(colors.indexOf(block)+1)%6]
    }
    else if(row==1 && col==2 && block==pawnColor){
        row = 2;
        col = 2
    }
    else if(col==2 && block==pawnColor){
        row = row+1;
        col = 2
    }
    else if(row==1 && col==2){
        row=1;
        col=3;
    }
    let nextCellId = block+"-"+row+"-"+col;
    console.log("cur,next->",curCellId,nextCellId);
    return nextCellId;
}

function killCoin(pawn){
    console.log("killed->",pawn);
    let playerColor = pawn.id.slice(0,pawn.id.length-7);
    let pawnNum = pawn.id[pawn.id.length-1];
    pawn.classList.remove("game-pawn");
    pawn.classList.add("home-pawn");
    document.getElementById(playerColor+"-"+"circle"+"-"+pawnNum).appendChild(pawn);
}

//Roll dice
function rollDice(){
    document.getElementById("roll-value").innerText = ``;
    let dice = document.querySelector(".dice");
    let i=1,k=1;
    let m = setInterval(() => {
        k+=1;
        if(k==7){
            k=1
        }
        dice.style.backgroundImage = `url("/images/dice-${k}.png")`;
        i++;
        if(i==15){
            clearInterval(m);
            rollButton.disabled = true;//Button disabled until move is made
            let randNum = Math.random()*6;
            randNum = Math.ceil(randNum);
            //randNum = 5;
            dice.style.backgroundImage =  `url("/images/dice-${randNum}.png")`;
            document.getElementById("roll-value").innerText = randNum;
            currentRollValue= randNum;
            console.log(currentPlayer," rolled-> ",randNum);
            let currPlayer;
            activePlayerObjects.forEach(p=>{
                if(p.name==currentPlayer){
                    currPlayer = p;
                }
            });
            let changed = false;
            if(!(currPlayer.pawn1.classList.contains("game-pawn") || currPlayer.pawn2.classList.contains("game-pawn") ||
            currPlayer.pawn3.classList.contains("game-pawn") || currPlayer.pawn4.classList.contains("game-pawn"))){
                    if(currentRollValue!=6){
                        setTimeout(() => {
                            rollButton.disabled = false;
                            currentPlayer = activePlayers[(activePlayers.indexOf(currentPlayer)+1)%activePlayers.length];
                            document.getElementById("current-player").innerText = currentPlayer;
                            document.querySelector(".player-info").style.background = currentPlayer;
                            console.log("control-passed----> ",currentPlayer);
                        }, 2000);
                        function dummy(){

                        }
                        
                            return;
                    }
                    
            }
            addListeners(currentPlayer);
            console.log("listener-count ->",getListenersCount(currentPlayer));
            if(getListenersCount(currentPlayer)==0){
                setTimeout(() => {
                    currentPlayer = activePlayers[(activePlayers.indexOf(currentPlayer)+1)%activePlayers.length];
                    document.getElementById("current-player").innerText = currentPlayer;
                    document.querySelector(".player-info").style.background = currentPlayer;
                    console.log("control-passed---> ",currentPlayer);
                    rollButton.disabled = false;
                }, 2000);
            }
            return(randNum,currentPlayer);
        }
    }, 100);
}

function getListenersCount(player){
    let count = 0;
    for(let i=1;i<=4;i++){
        pawn = document.getElementById(`${player}-pawn-${i}`);
        if(pawn.hasEventListener==true){
            count+=1;
        }
    }
    return count
}

function addListeners(player){
    console.log("Listeners added for -> ",player);
    for(let i=1;i<=4;i++){
        pawn = document.getElementById(`${player}-pawn-${i}`);
        pawn.hasEventListener = false;
        if(currentRollValue!=6 && pawn.classList.contains("home-pawn")){
            continue;
        }
        let pawnColor = pawn.id.slice(0,pawn.id.length-7);
        let blockColor = pawn.parentElement.id.slice(0,pawn.parentElement.id.length-4);
        if(pawnColor == blockColor){
                console.log("in home row at cell->",getCell(pawn.id));
                if(pawnColor+"-2-2"==getCell(pawn.id) && currentRollValue>5){
                    console.log("listener needs to be removed");
                    continue;
                }
                if(pawnColor+"-3-2"==getCell(pawn.id) && currentRollValue>4){
                    console.log("listener needs to be removed");
                    continue;
                }
                if(pawnColor+"-4-2"==getCell(pawn.id) && currentRollValue>3){
                    console.log("listener needs to be removed");
                    continue;
                }
                if(pawnColor+"-5-2"==getCell(pawn.id) && currentRollValue>2){
                    console.log("listener needs to be removed");
                    continue;
                }
                if(pawnColor+"-6-2"==getCell(pawn.id) && currentRollValue>1){
                    console.log("listener needs to be removed");
                    continue;
                }
        }
        pawn.addEventListener("click",pawnListeners);
        pawn.hasEventListener = true;
        pawn.listenerParams = [player,i];
    }
}

function pawnListeners(event){
    console.log("linstener clicked");
    let player = event.currentTarget.listenerParams[0];
    let i = event.currentTarget.listenerParams[1];
    let currCell = getCell(`${player}-pawn-${i}`);// current positon of pawn on board
    let currPlayer;
    activePlayerObjects.forEach(p=>{
        if(p.name==player){
            currPlayer = p;
        }
    });
    
    if(currCell.includes("circle") && currentRollValue !=6 ){
        console.log("--Invalid--");
        rollButton.disabled=false;
    }
    else if(currentRollValue==6 && currCell.includes("circle")){//If rolled six to spawn on board
        let pawn = document.getElementById(`${player}-pawn-${i}`);
        let parentCircle = pawn.parentElement;
        pawn.classList.remove("home-pawn");
        parentCircle.removeChild(pawn);
        pawn.classList.add("game-pawn");
        currPlayer.homeDoor.appendChild(pawn);
        rollButton.disabled=false;
        removeListeners(player);
    }
    else if(!(currCell.includes("circle"))){
        //To move
        console.log("moving");
        let pawn = event.srcElement;
        console.log("pawn->",pawn);
        moveCoin(currCell,pawn,currentRollValue);
        rollButton.disabled = false;
        removeListeners(player);

    }
    if(currentRollValue!=6){
        currentPlayer = activePlayers[(activePlayers.indexOf(currentPlayer)+1)%activePlayers.length];
        document.getElementById("current-player").innerText = currentPlayer;
        document.querySelector(".player-info").style.background = currentPlayer;
        console.log("control-passed--> ",currentPlayer);
        rollButton.disabled = false;
        removeListeners(player);
    }

}

function removeListeners(player){
    console.log("Listeners removed for -> ",player);
    for(let i=1;i<=4;i++){
        pawn = document.getElementById(`${player}-pawn-${i}`);
        pawn.removeEventListener("click",pawnListeners);
        pawn.hasEventListener = false;
    }
}

function getCell(pawnId){
    
    pawn = document.getElementById(pawnId);
    let cell = pawn.parentElement;
    let cellId = cell.id;
    return cellId
}




function initializePlayers(){

    activePlayers.forEach(player => {
        for(let i=1;i<=4;i++){
            let pawn = document.createElement("img");
            pawn.src = `/images/${player}-mark.png`;
            pawn.classList.add("home-pawn");
            pawn.id = `${player}-pawn-${i}`;
            
            document.getElementById(`${player}-circle-${i}`).appendChild(pawn);
        }
        
    });
    //safe Points
    let allCells = document.querySelectorAll(".cell");
    allCells.forEach(cell=>{
        if(cell.id.slice(cell.id.length-3,cell.id.length)=="3-1"){
            // cell.style.background = `url("/images/star.png")`;
            cell.style.backgroundImage = `url(/images/star.png)`;
            cell.style.backgroundSize = "contain";
        }
    })

}

initializePlayers();



//Board is completely done upto now
class Player{
    constructor(name){
        this.name = name,
        this.pawn1 = document.getElementById(`${name}-pawn-1`);
        this.pawn2 = document.getElementById(`${name}-pawn-2`);
        this.pawn3 = document.getElementById(`${name}-pawn-3`);
        this.pawn4 = document.getElementById(`${name}-pawn-4`);
        this.homeDoor = document.getElementById(`${name}-2-3`);
        this.acivePawns = [];
        this.homeReached = 3;
    }
}

const playerGreen = new Player("green");
const playerOrange = new Player("orange");
const playerBlue = new Player("blue");
const playerYellow = new Player("yellow");
const playerPurple = new Player("purple");
const playerRed = new Player("red");
var activePlayerObjects = [playerGreen,playerBlue,playerOrange,playerPurple,playerYellow,playerRed]
// console.log(playerGreen,playerBlue,playerOrange,playerPurple,playerYellow,playerRed);
