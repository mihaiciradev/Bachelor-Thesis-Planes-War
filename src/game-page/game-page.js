import React, {Component} from 'react';
import firebase from "firebase/app";
import "firebase/database";

import WaitingPage from "./waiting-page";
import NotAvailable from "./not-available";
import GameMenuButton from "./game-menu-button";
import AreYouSure from "./are-you-sure";
import './game.css';
import {Link} from "react-router-dom";


/*Game status
        * 101 - room created. No players joined yet.
        * 202 - Player 1 has joined.
        * 303 - Player 2 has joined. Room becomes unavailable
        *
*/

/*Pages id
        * 1 - waiting room
        * 2 - not available
        * 3 - place airplanes
        *
*/

/*canvas rules
  * 0 - liber
  * 1 - corp
  * 2 - cap
  * 3 - ratat
  * 4 - lovit
  * 5 - cap mort
  * */

function randomDegrees(){
    //Returneaza o valoare intreaga intre [-90,+90]. Folosit pentru a genera gradele in patratelele din avioane
    return (Math.floor(Math.random() * 180) - 90).toString();
}

function randomColor(){
    //Returneaza o pereche de culori, folosita pentru a genera culorile din patratelele din avioane
    var colors1 = [
        "#d98c3f",
        "#b0671e",
        "#d16c06",
        "#d4985b",
        "#fc7f00",
        "#a35507",
        "#b5824e",
        "#c49462"
    ]
    var colors2 = [
        "#c6c90e",
        "#dddeb3",
        "#dee03f",
        "#ebed64",
        "#eef202",
        "#c8ca76",
        "#eef09c"
    ]
    // const idx = Math.floor(Math.random() * colors.length)
    // const c1 = colors[idx];
    // colors.splice(idx,1)
    // const c2 = colors[Math.floor(Math.random() * colors.length)]

    const c1 = colors1[Math.floor(Math.random() * colors1.length)]
    const c2 = colors2[Math.floor(Math.random() * colors2.length)]
    return [c1,c2]
}

function datify(date){
    var dbDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
    return dbDate;
}

const UIStatusList = [
    "Set up your fleet",
    "Wait for the enemy",
    "The game will begin shortly",
    "Strike your enemy!",
    "It's your enemy's turn"
]
const LETTERS = "ABCDEFGHIJKLMNOPRSTUVWXYZ"

class GamePage extends Component{
    roomId = this.props.match.params.id
    roomConfig = null
    whoAmI = "N/A"
    database = firebase.database()
    messages = []

    constructor(props) {
        super(props);
        this.state = {
            currentPage:1, // 1 - waiting | 2 - unavailable | 3 - setup/game
            gamePhase: 1, // 1 - setup | 2 - game
            toggleChat: true, // daca este activ (sau nu) chatul
            reactMessages: [], // pentru logs
            planePosition:[0,0], // pozitia avionului curent selectat (pentru setup phase)
            planeSize:"small", // dimensiunea avionului curent selectat (pentru setup phase)
            planeDirection: "T", // directia avionului curent selectat (pentru setup phase)
            remainingFleet:"temporary", //se populeaza cand se apeleaza getRoomConfig
            remainingStrikes:"temporary",//se populeaza cand se apeleaza getRoomConfig
            selectedStrike:"small", //dimensiunea loviturii curente (pentru game phase)
            gameHasStarted: false, // false pentru mesajul "the game will start soon". True dupa ce incepe jocul.
            areYouSure :false, // mesaj de confirmare pentru plasare avion (Setup canvas)
            areYouSureText:"You are about to set a plane on the selected spot.",
            areYouSurePhase:1,
            currentPlaneSquares:[], //pentru areYouSure - sa se tina minte patratelele colorate, ca sa se stie care trebuie recolorate
            setupCanvas: [], //my canvas
            enemyCanvas: [], //enemy canvas
            isMyTurnNow:false, // true daca e randul jucatorului curent, false altfel
            canIPlacePlane:true,
            selectedStrikeSquares:[],
            totalNumberOfPlanes:0,
            isGameOver :0,
            status: UIStatusList[0], //big on-screen status message
            legend: true,
            statsSuccessfulHits: 0,
            statsTotalHits: 0,
            statsTakenDownPlanes:0

        }
    }


    //first called
    componentDidMount() {
        this.raiseSetupPage();
        document.body.style.paddingBottom = "0";
    }

    componentWillUnmount() {
        document.body.style.paddingBottom = "25vh";
    }

    //PAGES
    raiseUnavailablePage(){
        //In situatiile in care nu se mai primesc jucatori,pagina "Unavailable" va aparea.
        var State = this.state
        State.currentPage = 2
        this.setState(State)
    }

    //second called
    raiseSetupPage(){
        this.getGameStatus();
        this.getRoomConfig();
        this.fetchMessages();

        this.database.ref(`rooms/${this.roomId}/game/planePositions`).on('value',(snapshot)=>{
            if(this.roomConfig === null)
                return;
            if(snapshot.val()["player1"] === undefined || snapshot.val()["player2"] === undefined)
                return;

            if(snapshot.val()["player1"].length === this.roomConfig["numberOfAirplanes"])
                if(snapshot.val()["player2"].length === this.roomConfig["numberOfAirplanes"]){
                    this.updateUIStatus(UIStatusList[2])
                    this.raiseGamePage()
                }

        })

        this.database.ref(`rooms/${this.roomId}/game/isGameOver`).on('value',(snapshot)=>{
            const value = snapshot.val()
            if(value !== 0){
                this.gameOver(value)
            }


        })
    }

    gameOver(whoWon){
        let state = this.state
        state.isGameOver = whoWon
        this.setState(state)
        if(whoWon === this.whoAmI)
            this.updateUIStatus("You won the game!")
        else
            this.updateUIStatus("You lost the game.")

        // console.log(document.getElementsByClassName('footerObj'))

        const footers = document.getElementsByClassName('footerObj')
        for(let i=0 ; i<footers.length; i++) {
            footers[i].style.opacity = 0
            setTimeout(() => {
                footers[i].style.display = 'none';
            }, 800)
        };

        const legend = document.getElementById('legend-container')
        legend.style.opacity = 0;
        setTimeout(()=>{
            legend.style.display='none';
        },500)

        const gameOverBtns = document.getElementById('game-over-btns')

        gameOverBtns.style.opacity = 1;

    }

    raiseGamePage(){
        document.querySelectorAll(".footerObj").forEach((obj)=>{
            obj.style.opacity = "0";
        })
        setTimeout(()=>{
            var State = this.state
            State.gamePhase = 2;
            this.setState(State)
            this.preparePhaseTwoCanvas()

            var otherPlayer = this.whoAmI == 1 ? 2 : 1
            this.database.ref(`rooms/${this.roomId}/game/planePositions/player${otherPlayer}`).once('value')
                .then((snapshot)=>{
                    const enemyPlanes = snapshot.val()
                    enemyPlanes.forEach((plane)=>{
                        const squares = this.simulatePlaneSquares(plane.x,plane.y,plane.size,plane.direction)
                        squares.forEach((square)=>{
                            State.enemyCanvas[square[0]][square[1]] = 1
                        })
                        State.enemyCanvas[plane.x][plane.y] = 2
                    })
                })

            setTimeout(()=>{
                document.querySelectorAll(".footerObj").forEach((obj)=>{
                    obj.style.opacity = "1";
                })
            },800)
        },800)

    }
    //PAGES

    //GAME
    getGameStatus(){
        //Cand componenta se incarca, se verifica statusul jocului, pentru a vedea daca se mai primesc jucatori sau nu
        this.database.ref(`rooms/${this.roomId}/game/gameStatus`).once('value')
            .then((snapshot)=>{
                switch(snapshot.val()){
                    case 101:
                        this.firstPlayerHasEntered()
                        break;
                    case 202:
                        this.secondPlayerHasEntered()
                        break;
                    case 303:
                        this.raiseUnavailablePage()

                        // var State = this.state
                        // State.currentPage = 3
                        // this.setState(State)
                        // this.prepareSetupCanvas()
                        break;
                    default:
                        console.log("unknown case")
                }
            })
    }

    getRoomConfig(){
        // Cand componenta se incarca pe pagina, se apeleaza functia, pentru a avea acces rapid, in memorie la configuratiile camerei
        this.database.ref(`rooms/${this.roomId}/config`).once('value')
            .then((snapshot)=>{
                this.roomConfig = snapshot.val()

                var State = this.state

                State.remainingFleet = snapshot.val().fleet
                State.remainingStrikes = snapshot.val().attacks
                State.totalNumberOfPlanes = snapshot.val().numberOfAirplanes

                //setupCanvas (disponibilitate)
                for(let i = 0 ; i < snapshot.val().canvasSize ; i++){
                    State.setupCanvas.push([])
                    State.enemyCanvas.push([])
                    for(let j = 0 ; j < snapshot.val().canvasSize ; j++){
                        State.setupCanvas[i].push(0)
                        State.enemyCanvas[i].push(0)
                    }
                }

                this.setState(State)

                this.activateLogsListener();
            })
    }

    firstPlayerHasEntered(){
        //Atunci cand primul jucator intra, se apeleaza functia
        var updates = {}
        updates[`rooms/${this.roomId}/game/gameStatus`] = 202
        this.database.ref().update(updates)


         this.whoAmI = 1

         //listener
         this.database.ref(`rooms/${this.roomId}/game/gameStatus`).on('value',(snapshot)=>{
             if(snapshot.val() === 303){
                 var State = this.state
                 State.currentPage = 3
                 this.setState(State)
                 this.prepareSetupCanvas();
             }
         })
    }

    secondPlayerHasEntered(){
        //Atunci cand cel de-al doilea jucator intra, se apeleaza functia. Se blocheaza camera, nu mai poate intra alt jucator
        var updates = {}
        updates[`rooms/${this.roomId}/game/gameStatus`] = 303
        this.database.ref().update(updates)
            .then(()=>{
                var State = this.state
                State.currentPage = 3
                this.setState(State)
                this.prepareSetupCanvas();
            })

        this.whoAmI = 2
    }

    updateUIStatus(status){
        var State = this.state
        var StatusHMTL =  document.querySelector("#game-header>p")

        if(StatusHMTL){
            StatusHMTL.style.transform="rotateX(90deg)";
            setTimeout(()=>{
                StatusHMTL.style.transform="rotateX(0deg)";

                State.status = status
                this.setState(State)
            },350)
        }

    }
    //GAME

    //CHAT
    toggleChat(){
        //Se schimba disponibilitatea chatului (din inchis in deschis si vice-versa)
        var State = this.state
        State.toggleChat = !State.toggleChat
        this.setState(State)

        setTimeout(()=>{
            try{
                document.getElementById("game-chat-closed").addEventListener('click',()=>{this.toggleChat()})
            }
            catch{
                console.log("catched")
            }
        },100)
    }

    fetchMessages(){
        this.database.ref(`rooms/${this.roomId}/chat`).on('value',(snapshot)=>{
            var Messages = snapshot.val()
            if(Messages === "")
                this.messages = []
            else{
                var State = this.state
                State.reactMessages = []
                this.messages = Messages
                var index = 0;
                Messages.forEach((message)=>{
                    const player = message.from === this.whoAmI ? "Me" : "Enemy"
                    const color = message.from === this.whoAmI ? "game-chat-me" : "game-chat-enemy"
                    State.reactMessages.push(
                        <p key={"message-"+index}><span className={color}>{player}:</span>{message.text}</p>
                    )
                    index = index  + 1
                })
                this.setState(State)

                document.getElementById("game-chat-texting").scrollTop =  document.getElementById("game-chat-texting").scrollHeight
            }
        })
    }

    sendMessage(){
        //Se apeleaza atunci cand se trimite un mesaj pe chat

        const value = document.getElementById("game-chat-input").value
        document.getElementById("game-chat-input").value = ""

        if(value === "")
            return;

        const newMessage = {
            from: this.whoAmI,
            text: value
        }
        this.messages.push(newMessage)


        var updates = {}

        updates[`rooms/${this.roomId}/chat`] = this.messages
        this.database.ref().update(updates)

        setTimeout(()=>{
            document.getElementById("game-chat-texting").scrollTop =  document.getElementById("game-chat-texting").scrollHeight
        },100)
    }
    //CHAT

    //SETUP CANVAS
    prepareSetupCanvas(){
        //pregateste tabla de pregatire, unde se aleg locurile avioanelor
        this.database.ref(`rooms/${this.roomId}/config/canvasSize`).once('value')
            .then((snapshot) => {
                const CANVAS_SIZE = snapshot.val() * snapshot.val()
                console.log("Creating canvas with: ",CANVAS_SIZE, "Val: ",snapshot.val())
                setTimeout(()=>{
                    // document.getElementById("game-canvas-container").innerHTML = `<div class="game-canvas" id="setup-canvas">
                    //     <div class="canvas-letters"></div>
                    //     <div class="canvas-numbers"></div>
                    // </div>`

                    document.querySelectorAll(".canvas-letters").forEach((obj)=>{
                        const letters = LETTERS
                        for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                            obj.insertAdjacentHTML('beforeend', `<p>${letters[i]}</p>`)
                    })

                    document.querySelectorAll(".canvas-numbers").forEach((obj)=>{
                        for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                            obj.insertAdjacentHTML('beforeend', `<p>${i+1}</p>`)
                    })

                    for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                        for(let j = 0 ; j < Math.sqrt(CANVAS_SIZE) ; j++)
                        {
                            document.getElementById("setup-canvas").insertAdjacentHTML('beforeend', `<div class="game-canvas-square" id="setup-square/${i}-${j}"></div>`)

                            document.getElementById(`setup-square/${i}-${j}`).addEventListener('mouseover',()=>{
                                //if canIPlaceItHere
                                if(!this.state.areYouSure && this.state.canIPlacePlane && !this.state.isGameOver){
                                    this.simulatePlane(this.simulatePlaneSquares(i,j,this.state.planeSize,this.state.planeDirection))
                                }
                            })
                            document.getElementById(`setup-square/${i}-${j}`).addEventListener('mouseout',()=>{
                                if(!this.state.areYouSure && this.state.canIPlacePlane && !this.state.isGameOver){
                                    this.deleteSimulation(this.simulatePlaneSquares(i,j,this.state.planeSize,this.state.planeDirection))
                                }

                            })
                            document.getElementById(`setup-square/${i}-${j}`).addEventListener('click',()=>{
                                if(!this.state.areYouSure && this.state.canIPlacePlane && !this.state.isGameOver)
                                    this.placePlane(i,j)
                            })
                        }
                },500)

                document.querySelectorAll(".footerObj").forEach((obj)=>{
                    obj.style.opacity = "1";
                })
            })


    }

    simulatePlaneSquares(i,j,PLANE_SIZE,DIRECTION){
        const plane = PLANE_SIZE+"-"+DIRECTION
        var squares = []
        switch(plane){
            case "small-T":
                squares = [
                                         [i,j],
                    [i+1,j-2],[i+1,j-1],[i+1,j],[i+1,j+1],[i+1,j+2],
                                        [i+2,j],
                              [i+3,j-1],[i+3,j],[i+3,j+1]
                ]
                break;
            case "small-B":
                squares = [
                              [i-3,j-1],[i-3,j],[i-3,j+1],
                                        [i-2,j],
                    [i-1,j-2],[i-1,j-1],[i-1,j],[i-1,j+1],[i-1,j+2],
                                        [i,j]
                ]
                break;
            case "small-R":
                squares = [
                                        [i-2,j-1],
                    [i-1,j-3],          [i-1,j-1],
                    [i,j-3]  , [i,j-2] ,[i,j-1] , [i,j],
                    [i+1,j-3]     ,     [i+1,j-1],
                                        [i+2,j-1]
                ]
                break;
            case "small-L":
                squares = [
                            [i-2,j+1],
                            [i-1,j+1],      [i-1,j+3],
                    [i,j]  ,[i,j+1], [i,j+2],[i,j+3],
                            [i+1,j+1],       [i+1,j+3],
                            [i+2,j+1]
                    ]
                break;
            case "medium-T":
                squares = [
                                                 [i,j],
                   [i+1,j-3],[i+1,j-2],[i+1,j-1],[i+1,j],[i+1,j+1],[i+1,j+2],[i+1,j+3],
                                                [i+2,j],
                                                [i+3,j],
                                      [i+4,j-1],[i+4,j],[i+4,j+1]
                ]
                break;
            case "medium-B":
                squares = [
                                       [i-4,j-1],[i-4,j],[i-4,j+1],
                                                 [i-3,j],
                                                 [i-2,j],
                    [i-1,j-3],[i-1,j-2],[i-1,j-1],[i-1,j],[i-1,j+1],[i-1,j+2],[i-1,j+3],
                                                  [i,j]
                ]
                break;
            case "medium-R":
                squares = [
                                            [i-3,j-1],
                                            [i-2,j-1],
                    [i-1,j-4],              [i-1,j-1],
                    [i,j-4],[i,j-3],[i,j-2],[i,j-1], [i,j],
                    [i+1,j-4]  ,            [i+1,j-1],
                                            [i+2,j-1],
                                            [i+3,j-1]
                ]
                break;
            case "medium-L":
                squares = [
                        [i-3,j+1],
                        [i-2,j+1],
                        [i-1,j+1],              [i-1,j+3],
                    [i,j],[i,j+1],[i,j+2],[i,j+3],[i,j+3],
                        [i+1,j+1],              [i+1,j+3],
                        [i+2,j+1],
                        [i+3,j+1]
                ]
                break;
            case "big-T":
                squares = [
                                                             [i,j],
                    [i+1,j-4],[i+1,j-3],[i+1,j-2],[i+1,j-1],[i+1,j],[i+1,j+1],[i+1,j+2],[i+1,j+3],[i+1,j+4],
                                                            [i+2,j],
                                                            [i+3,j],
                                        [i+4,j-2],[i+4,j-1],[i+4,j],[i+4,j+1],[i+4,j+2]

                ]
                break;
            case "big-B":
                squares = [
                                        [i-4,j-2],[i-4,j-1],[i-4,j],[i-4,j+1],[i-4,j+2],
                                                            [i-3,j],
                                                            [i-2,j],
                    [i-1,j-4],[i-1,j-3],[i-1,j-2],[i-1,j-1],[i-1,j],[i-1,j+1],[i-1,j+2],[i-1,j+3],[i-1,j+4],
                                                             [i,j]
                ]
                break;
            case "big-R":
                squares = [
                                            [i-4,j-1],
                                            [i-3,j-1],
                    [i-2,j-4],              [i-2,j-1],
                    [i-1,j-4],              [i-1,j-1],
                    [i,j-4],[i,j-3],[i,j-2],[i,j-1], [i,j],
                    [i+1,j-4],              [i+1,j-1],
                    [i+2,j-4],              [i+2,j-1],
                                            [i+3,j-1],
                                            [i+4,j-1]
                ]
                break;
            case "big-L":
                squares =[
                        [i-4,j+1],
                        [i-3,j+1],
                        [i-2,j+1],              [i-2,j+4],
                        [i-1,j+1],              [i-1,j+4],
                [i,j],  [i,j+1],[i,j+2],[i,j+3],[i,j+4],
                        [i+1,j+1],              [i+1,j+4],
                        [i+2,j+1],              [i+2,j+4],
                        [i+3,j+1],
                        [i+4,j+1]
                ]
                break;
            default:
                break;
        }
        return squares;
    }

    simulatePlane(squares){
        var FAIL = false;
        squares.forEach((pair)=>{
            try{
                var Square = document.getElementById(`setup-square/${pair[0]}-${pair[1]}`)
                if(this.state.setupCanvas[pair[0]][pair[1]] === 0)
                    Square.style.background = "rgba(112, 202, 212,0.4)";

                if(Square === null || this.state.setupCanvas[pair[0]][pair[1]] === 1)
                    throw "err";
            }
            catch{
                FAIL = true;
                return;
            }
        })
        if(FAIL){
            squares.forEach((pair)=>{
                try{
                    if(this.state.setupCanvas[pair[0]][pair[1]] === 0)
                        document.getElementById(`setup-square/${pair[0]}-${pair[1]}`).style.background = "#910C0C";
                }
                catch{
                    //aia e...
                }
            })
        }
            // this.deleteSimulation(squares)
    }

    deleteSimulation(squares){
        squares.forEach((pair)=>{
            try{
                if(this.state.setupCanvas[pair[0]][pair[1]] === 0)
                    document.getElementById(`setup-square/${pair[0]}-${pair[1]}`).style.background = "transparent";
            }
            catch{
                //pass
            }
        })
    }

    canIPlaceItHere(x,y){
        //se verifica daca este posibila plasarea unui avion in pozitia X,Y. Dimensiunea si directia avionului sunt preluate (automat) din State.

        const squares = this.simulatePlaneSquares(x,y,this.state.planeSize,this.state.planeDirection)
        var FAIL = false

        //OUT OF BOUNDS verification
        squares.forEach((square)=>{
            if(square[0] < 0 || square[1] < 0 || square[0] >= this.roomConfig.canvasSize || square[1] >= this.roomConfig.canvasSize){
                FAIL = true;
            }


        })

        //OVERLAP verification
        var State = this.state
        if(!FAIL){
            squares.forEach((square)=>{
                    if(State.setupCanvas[square[0]][square[1]] > 0){
                        FAIL = true;
                        return;
                    }
            })
        }



        return (FAIL? false:true)


    }

    confirmPlacePlane(){
        var State = this.state
        const squares = this.simulatePlaneSquares(State.planePosition[0],State.planePosition[1],State.planeSize,State.planeDirection)

        //colorize the squares
        const randomDegree = randomDegrees()
        const colors = randomColor()


        squares.forEach((square)=>{
            State.setupCanvas[square[0]][square[1]] += 1
            document.getElementById(`setup-square/${square[0]}-${square[1]}`).style.background = "linear-gradient("+randomDegree+"deg,"+colors[0]+" 0% 30%,"+colors[1]+" 70%)";
        })
        State.setupCanvas[State.planePosition[0]][State.planePosition[1]] = 2 // head

        //close the confirm box
        this.closeAreYouSure(true)

        //update the remaining fleet
        var remainingFleet = this.state.remainingFleet
        remainingFleet[0] = (State.planeSize === "small" ? remainingFleet[0]-1 : remainingFleet[0])
        remainingFleet[1] = (State.planeSize === "medium" ? remainingFleet[1]-1 : remainingFleet[1])
        remainingFleet[2] = (State.planeSize === "big" ? remainingFleet[2]-1 : remainingFleet[2])

        //update the plane size selection button
        var newPlaneSize;
        if(remainingFleet[0] > 0)
            newPlaneSize = "small"
        else{
            if(remainingFleet[1] > 0)
                newPlaneSize = "medium"
            else{
                if(remainingFleet[2] > 0)
                    newPlaneSize = "big"
                else
                    newPlaneSize = null
            }
        }
        if(newPlaneSize)
            setTimeout(()=>{this.changePlaneSize(newPlaneSize)},300)
        else{
            //pass
        }

        //prepare plane for DB
        const plane = {
            x:State.planePosition[0],
            y:State.planePosition[1],
            size:State.planeSize,
            direction: State.planeDirection,
            degrees: randomDegree,
            colors: colors
        }

        //prepare log for DB
        const log = {
            type: "plane-set",
            log:[this.whoAmI,(remainingFleet.reduce((a,b)=>a+b,0))]
        }

        //send log
        var updates = {}
        this.database.ref(`rooms/${this.roomId}/game/logs`).once('value')
            .then((snapshot)=>{
                var logs = snapshot.val() === "" ? [] : snapshot.val()
                logs.push(log)

                updates[`rooms/${this.roomId}/game/logs`] = logs;

                this.database.ref().update(updates);
            })

        //send plane info
        updates = {}
        this.database.ref(`rooms/${this.roomId}/game/planePositions`).once('value')
            .then((snapshot)=>{
                var positions = snapshot.val() === "" ? {player1:"",player2:""} : snapshot.val()
                if(typeof positions["player"+this.whoAmI] === "string")
                    positions["player"+this.whoAmI] = [plane]
                else
                    positions["player"+this.whoAmI].push(plane)

                updates[`rooms/${this.roomId}/game/planePositions`] = positions;
                this.database.ref().update(updates);
            })

        //check if the last plane has been placed
        if(remainingFleet[0] === 0 &&  remainingFleet[1] === 0 && remainingFleet[2] === 0){
            State.canIPlacePlane = false;

            this.database.ref(`rooms/${this.roomId}/game/planePositions`).once('value')
                .then((snapshot)=>{
                    const enemy = (this.whoAmI === 1) ? 2 : 1
                    if(snapshot.val()["player"+enemy] === undefined || snapshot.val()["player"+enemy].length < this.roomConfig["numberOfAirplanes"])
                        this.updateUIStatus(UIStatusList[1])
                })
        }

        //update state
        this.setState(State)
    }

    closeAreYouSure(proceed=false,strikes=false){
        document.getElementById("areYouSure").style.opacity = "0";
        document.getElementById("areYouSure").style.transform = "translateX(-50%) rotateX(90deg)"

        let State = this.state

        if(!strikes){
            if(!proceed)
                State.currentPlaneSquares.forEach((square)=>{
                    document.getElementById(`setup-square/${square[0]}-${square[1]}`).style.background="transparent";
                })

            State.areYouSure = false
            State.currentPlaneSquares = []
        }
        if(strikes){
            if(!proceed){
                State.isMyTurnNow = true
                State.selectedStrikeSquares.forEach((square)=>{
                    if(document.getElementById(`enemy-canvas-square/${square[0]}-${square[1]}`))
                        document.getElementById(`enemy-canvas-square/${square[0]}-${square[1]}`).innerHTML = this.getSquareSvg(square[0],square[1],false).svg
                })
            }
            else{
                State.isMyTurnNow = false
                this.confirmStrike()
            }
        }
        this.setState(State)
    }

    raiseAreYouSure(){
        document.getElementById("areYouSure").style.opacity = "1";
        document.getElementById("areYouSure").style.transform = "translateX(-50%) rotateX(0deg)"
    }

    placePlane(i,j){
        //se apeleaza atunci cand se apasa pe un patrat din joc
        if(this.canIPlaceItHere(i,j)){
            const squares = this.simulatePlaneSquares(i,j,this.state.planeSize,this.state.planeDirection)
            squares.forEach((square)=>{
                document.getElementById(`setup-square/${square[0]}-${square[1]}`).style.background="#79bdb0"
            })

            var State = this.state
            State.areYouSure = true;
            State.planePosition[0] = i;
            State.planePosition[1] = j;
            State.currentPlaneSquares = this.simulatePlaneSquares(i,j,this.state.planeSize,this.state.planeDirection)
            this.setState(State)

            this.raiseAreYouSure()
        }
        else{
            console.log("nope")
        }


    }

    menuRotateLeft(){
         var State = this.state

        switch(State.planeDirection){
            case "T":
                State.planeDirection = "L"
                break;
            case "B":
                State.planeDirection = "R"
                break;
            case "R":
                State.planeDirection = "T"
                break;
            case "L":
                State.planeDirection = "B"
                break;
            default:
                console.log("Error. Plane direction unkown: ",State.planeDirection)
        }
        document.querySelector("#menu-rotate-left>button>svg").style.transform = "scale(.8)";
        document.querySelector("#menu-rotate-left>button>svg").style.boxShadow = "0 0 7px 3px white";
         setTimeout(()=>{
             document.querySelector("#menu-rotate-left>button>svg").style.transform = "scale(1)";
             document.querySelector("#menu-rotate-left>button>svg").style.boxShadow = "0 0 0 0 transparent";
         },300)

        this.setState(State)
    }

    menuRotateRight(){
        var State = this.state

        switch(State.planeDirection){
            case "T":
                State.planeDirection = "R"
                break;
            case "B":
                State.planeDirection = "L"
                break;
            case "R":
                State.planeDirection = "B"
                break;
            case "L":
                State.planeDirection = "T"
                break;
            default:
                console.log("Error. Plane direction unkown: ",State.planeDirection)
        }

        document.querySelector("#menu-rotate-right>button>svg").style.transform = "scale(.8)";
        document.querySelector("#menu-rotate-right>button>svg").style.boxShadow = "0 0 7px 3px white";
        setTimeout(()=>{
            document.querySelector("#menu-rotate-right>button>svg").style.transform = "scale(1)";
            document.querySelector("#menu-rotate-right>button>svg").style.boxShadow = "0 0 0 0 transparent";
        },300)

        this.setState(State)
    }

    changePlaneSize(newSize){
        if(document.querySelector("#menu-plane-1>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-plane-1>button>svg:nth-of-type(2)").style.opacity = "0";

        if(document.querySelector("#menu-plane-2>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-plane-2>button>svg:nth-of-type(2)").style.opacity = "0";

        if(document.querySelector("#menu-plane-3>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-plane-3>button>svg:nth-of-type(2)").style.opacity = "0";


        var State = this.state

        switch(newSize){
            case "small":
                document.querySelector("#menu-plane-1>button>svg:nth-of-type(2)").style.opacity="1";
                State.planeSize = "small"
                break;
            case "medium":
                document.querySelector("#menu-plane-2>button>svg:nth-of-type(2)").style.opacity="1";
                State.planeSize = "medium"
                break;
            case "big":
                document.querySelector("#menu-plane-3>button>svg:nth-of-type(2)").style.opacity="1";
                State.planeSize = "big"
                break;
            default:
                console.log("unknown size.")
        }

        this.setState(State)

    }
    //SETUP CANVAS

    //PHASE 2
    preparePhaseTwoCanvas(){
        this.database.ref(`rooms/${this.roomId}/config/canvasSize`).once('value')
            .then((snapshot) =>{
                const CANVAS_SIZE = snapshot.val() * snapshot.val()
                //letters
                document.querySelectorAll(".canvas-letters").forEach((obj)=>{
                    const letters = LETTERS
                    for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                        obj.insertAdjacentHTML('beforeend', `<p>${letters[i]}</p>`)
                })

                //numbers
                document.querySelectorAll(".canvas-numbers").forEach((obj)=>{
                    for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                        obj.insertAdjacentHTML('beforeend', `<p>${i+1}</p>`)
                })

                //listeners
                for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                    for(let j = 0 ; j < Math.sqrt(CANVAS_SIZE) ; j++)
                    {
                        document.getElementById("my-canvas").insertAdjacentHTML('beforeend', `<div class="game-canvas-square" id="my-canvas-square/${i}-${j}"></div>`)
                        document.getElementById("enemy-canvas").insertAdjacentHTML('beforeend', `<div class="game-canvas-square" id="enemy-canvas-square/${i}-${j}"></div>`)
                    }

                for (let i = 0; i < Math.sqrt(CANVAS_SIZE); i++)
                    for(let j = 0 ; j < Math.sqrt(CANVAS_SIZE) ; j++){
                        document.getElementById(`enemy-canvas-square/${i}-${j}`).addEventListener("click",()=>{
                            if(this.state.gameHasStarted && this.state.isMyTurnNow)
                                this.simulateStrike(this.getStrikeSquares(i,j,this.state.selectedStrike))
                        })
                        // document.getElementById(`enemy-canvas-square/${i}-${j}`).addEventListener("mouseenter",()=>{
                        //     if(this.state.gameHasStarted && this.state.isMyTurnNow)
                        //         this.simulateStrike(this.getStrikeSquares(i,j,this.state.selectedStrike))
                        // })
                        // document.getElementById(`enemy-canvas-square/${i}-${j}`).addEventListener("mouseleave",()=>{
                        //     if(this.state.gameHasStarted && this.state.isMyTurnNow)
                        //         this.deleteSimulateStrike(this.getStrikeSquares(i,j,this.state.selectedStrike))
                        // })
                    }

                //fill 1 canvas with planes
                this.populateMyCanvas()

            })


    }

    populateMyCanvas(){
    //    fills the player's canvas with his planes
    //     const CANVAS_SIZE = this.roomConfig.canvasSize

        this.database.ref(`rooms/${this.roomId}/game/planePositions/player${this.whoAmI}`).once('value')
            .then((snapshot)=>{
                const planes = snapshot.val()
                planes.forEach((plane)=>{

                    const planeSquares = this.simulatePlaneSquares(plane.x,plane.y,plane.size,plane.direction)

                    planeSquares.forEach((square)=>{
                        document.getElementById(`my-canvas-square/${square[0]}-${square[1]}`).style.background = "linear-gradient("+plane.degrees+"deg,"+plane.colors[0]+" 0% 30%,"+plane.colors[1]+" 70%)";                    })

                })
            })

        setTimeout(()=>{
            this.beginGame()
        },500)
    }

    beginGame(){
        let State = this.state
        State.gameHasStarted = true;
        
        this.database.ref(`rooms/${this.roomId}/game/currentTurn`).on('value',(snapshot)=>{
            let State = this.state
            State.isMyTurnNow = (snapshot.val() == this.whoAmI ? true : false)
            if(State.isMyTurnNow){
                this.updateUIStatus(UIStatusList[3])
            }
            else{
                this.updateUIStatus(UIStatusList[4])
            }
            this.setState(State)
        })

        this.database.ref(`rooms/${this.roomId}/game/strikesHistory`).on('value',(snapshot)=>{
            let State = this.state
            let DBStrikes = snapshot.val()
            if(!DBStrikes) return;
            DBStrikes.forEach((strikePackage)=>{
                if(strikePackage.from !== this.whoAmI)
                    strikePackage.strikes.forEach((strike)=>{
                        if(State.setupCanvas[strike[0]][strike[1]] !== this.rules(State.setupCanvas[strike[0]][strike[1]])){
                            State.setupCanvas[strike[0]][strike[1]] = this.rules(State.setupCanvas[strike[0]][strike[1]])
                            document.getElementById(`my-canvas-square/${strike[0]}-${strike[1]}`).innerHTML = this.getSquareSvg(strike[0],strike[1],true).svg
                        }
                    })
            })
        })


        this.setState(State)
    }

    changeStrikeSize(newSize){
        if(document.querySelector("#menu-small-strike>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-small-strike>button>svg:nth-of-type(2)").style.opacity = "0";

        if(document.querySelector("#menu-medium-strike>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-medium-strike>button>svg:nth-of-type(2)").style.opacity = "0";

        if(document.querySelector("#menu-big-strike>button>svg:nth-of-type(2)"))
            document.querySelector("#menu-big-strike>button>svg:nth-of-type(2)").style.opacity = "0";

        var State = this.state

        switch(newSize){
            case "small":
                document.querySelector("#menu-small-strike>button>svg:nth-of-type(2)").style.opacity="1";
                State.selectedStrike = "small"
                break;
            case "medium":
                document.querySelector("#menu-medium-strike>button>svg:nth-of-type(2)").style.opacity="1";
                State.selectedStrike = "medium"
                break;
            case "big":
                document.querySelector("#menu-big-strike>button>svg:nth-of-type(2)").style.opacity="1";
                State.selectedStrike = "big"
                break;
            default:
                console.log("unknown size.")
        }

        this.setState(State)

    }

    getStrikeSquares(i,j,size){
        var arrayOfSquares = []
        switch(size){
            case "small":
                arrayOfSquares.push([i,j])
                break;
            case "medium":
                arrayOfSquares.push([i,j])
                arrayOfSquares.push([i+1,j+1])
                arrayOfSquares.push([i+1,j])
                arrayOfSquares.push([i,j+1])
                break;
            case "big":
                arrayOfSquares.push([i-1,j-1])
                arrayOfSquares.push([i-1,j])
                arrayOfSquares.push([i-1,j+1])
                arrayOfSquares.push([i,j-1])
                arrayOfSquares.push([i,j])
                arrayOfSquares.push([i,j+1])
                arrayOfSquares.push([i+1,j-1])
                arrayOfSquares.push([i+1,j])
                arrayOfSquares.push([i+1,j+1])
                break;
            default:
                console.log("unknown strike size")
                break;
        }
        return arrayOfSquares
    }

    getSquareSvg(x,y,myCanvas){
        let canvas = myCanvas === true ? this.state.setupCanvas : this.state.enemyCanvas
        let squareId = canvas[x][y]
        let envelope = {
            id: squareId,
            svg: "none",
            hit: false,
            dead: false
        }
        switch(squareId){
            case 0:
                envelope.svg= ""
                break;
            case 1:
                envelope.svg =  ""
                break;
            case 2:
                envelope.svg = ""
                break;
            case 3:
                envelope.svg =  `<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="3" fill="#CCED70"/></svg>`;
                break;
            case 4:
                envelope.svg =  `<svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 22L10 14.5M17 7L10 14.5M10 14.5L3 7L17 22" stroke="#BE2D19" stroke-width="2"/></svg>`
                envelope.hit = true
                break;
            case 5:
                envelope.svg =  `<svg  viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.1241 23.5027V27.8066H23.247H26.0051V23.5027L26.6719 23.3512L27.8237 22.5328L29.2785 21.1992L30.6728 19.411L31.3699 17.8046L31.6123 15.3798L31.3699 13.3188L30.2181 10.8637L28.3086 8.95426L26.0051 7.56003L23.4288 6.62044L21.6406 6.34766H19.5796L17.0336 6.86291L14.336 7.89343L12.2144 9.40889L10.4868 11.5002L9.57749 13.5613L9.39563 16.0163L9.78965 18.1683L10.7595 20.1384L12.3659 21.8054L14.0026 22.9268L15.1241 23.5027Z" stroke="#680606" stroke-width="2"/><path d="M6.18268 8.43851L10.0623 12.5L11.305 10.4389L7.78907 7.07459L7.91031 6.98366L8.36495 6.55933L8.63773 5.89253L8.81959 4.98325L8.63773 4.19521L8.1831 3.43748L6.8798 3.04346L5.75835 3.28593L5.03093 4.04366L4.81876 4.68016V5.58944L4.24289 5.37727L3.06083 5.58944L2.18186 6.55933L2 7.92325L2.57588 9.01439L4.39443 9.59026L5.87959 9.13562L6.18268 8.43851Z" stroke="#680606" stroke-width="2"/><path d="M34.3381 7.56941L30.6362 11.7934L29.3063 9.78758L32.6747 6.27561L32.5497 6.18996L32.0773 5.78552L31.7762 5.13102L31.5555 4.23037L31.7034 3.43526L32.1251 2.65873L33.4103 2.2092L34.5411 2.40337L35.3004 3.12923L35.5396 3.75604L35.5786 4.66448L36.1449 4.42782L37.3349 4.58912L38.2547 5.52044L38.4948 6.87531L37.9663 7.99013L36.1741 8.64344L34.6708 8.25289L34.3381 7.56941Z" stroke="#680606" stroke-width="2"/><path d="M17.4576 26.4429V27.6552H19.4277M19.4277 27.6552V26.4429M19.4277 27.6552H21.3372M21.3372 27.6552V26.4429M21.3372 27.6552H23.277V26.4429" stroke="#680606"/><circle cx="16.2757" cy="18.1978" r="2.54598" fill="#680606"/><circle cx="24.7623" cy="18.3805" r="2.54598" fill="#680606"/><path d="M20.3977 20.8052L22.5501 24.5332H18.2453L20.3977 20.8052Z" fill="#680606"/><path d="M6.12203 27.5634L12.1233 21.4409L13.8812 22.8048L7.6678 28.9576L7.97089 29.1395L8.54677 29.9275L8.78925 31.1702L8.54677 32.2916L7.78904 33.0797L6.91007 33.2009L5.84924 33.0797L4.97027 32.5644L4.66718 31.5036L4.81873 30.4428H3.87914L3.06079 30.2306L2.27275 29.3213L2.03027 28.1999L2.27275 27.2603C2.53543 27.0178 3.08504 26.5268 3.18203 26.5026C3.27902 26.4783 4.01048 26.3712 4.36409 26.3207L5.3946 26.8057L6.12203 27.5634Z" stroke="#680606" stroke-width="2"/><path d="M34.7643 27.9579L28.7631 21.8354L27.0051 23.1994L33.2186 29.3522L32.9155 29.534L32.3396 30.3221L32.0971 31.5647L32.3396 32.6862L33.0973 33.4742L33.9763 33.5955L35.0371 33.4742L35.9161 32.959L36.2192 31.8981L36.0676 30.8373H37.0072L37.8256 30.6251L38.6136 29.7159L38.8561 28.5944L38.6136 27.6548C38.3509 27.4124 37.8013 26.9213 37.7043 26.8971C37.6073 26.8729 36.8759 26.7658 36.5223 26.7152L35.4917 27.2002L34.7643 27.9579Z" stroke="#680606" stroke-width="2"/></svg>`
                envelope.dead = true
                break;
            default:
                console.log("getSquareSvg error, unknown square id: ",squareId)
                envelope.svg =  "err"
                break;
        }
        return envelope
    }

    simulateStrike(attacks){
        let State = this.state
        State.isMyTurnNow = false;
        State.selectedStrikeSquares = attacks
    //    attacks = array of striked squares
        attacks.forEach((square)=>{
            try{
                document.getElementById(`enemy-canvas-square/${square[0]}-${square[1]}`).innerHTML =
                    `<svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="4.5" stroke="#BE2D19"/><line x1="7.5" y1="16" x2="7.5" stroke="#BE2D19"/><line x1="8.5" y1="16" x2="8.5" stroke="#BE2D19"/><line x1="0.00137832" y1="7.5" x2="16.0013" y2="7.54411" stroke="#BE2D19"/><line x1="0.00137832" y1="8.5" x2="16.0013" y2="8.54411" stroke="#BE2D19"/></svg>`
            }
            catch{
                //pass
            }
        })
        State.areYouSureText = "You are about to strike the selected spot(s)."
        State.areYouSurePhase=2
        this.raiseAreYouSure();
        this.setState(State)
    }

    rules(id){
        /*canvas rules
        * 0 - liber
        * 1 - corp
        * 2 - cap
        * 3 - ratat
        * 4 - lovit
        * 5 - cap mort
        * */
        if(id === 0) return 3;// liber => ratat
        if(id === 1) return 4;// corp => lovit
        if(id === 2) return 5;// cap => cap lovit
        if(id === 3) return 3;// ratat => ratat
        if(id === 4) return 4;// corp lovit => cap mort
        if(id === 5) return 5;// cap mort => cap mort
        console.log("rule unknown: ",id)
        return "err rules"
    }

    hitEnemy(squares){

        let State = this.state
        squares.forEach((square)=>{
            let todel = State.enemyCanvas[square[0]][square[1]]
            //change canvas id
            State.enemyCanvas[square[0]][square[1]] = this.rules(State.enemyCanvas[square[0]][square[1]])

            //change svg
            const hit_response = this.getSquareSvg(square[0],square[1],false)
            document.getElementById(`enemy-canvas-square/${square[0]}-${square[1]}`).innerHTML = hit_response.svg

            if(hit_response.hit)
                State.statsSuccessfulHits += 1

            if(hit_response.dead)
                State.statsTakenDownPlanes += 1

            State.statsTotalHits += 1

            this.setState(State)
        })
    }

    didIWin(){
        //returns true if i won, false otherwise
        let countDeadHeads = 0;

        this.state.enemyCanvas.forEach(line=>{
            line.forEach(elem=>{
                countDeadHeads = (elem === 5 ? countDeadHeads+1 : countDeadHeads);
            })
        })

        return this.state.totalNumberOfPlanes === countDeadHeads;
    }

    confirmStrike(){
        let State = this.state


        //canvas graphic
        this.hitEnemy(State.selectedStrikeSquares)

        let strike = {
            from: this.whoAmI,
            strikes: State.selectedStrikeSquares
        }

        //strike history
        this.database.ref(`rooms/${this.roomId}/game/strikesHistory`).once('value')
            .then((snapshot)=>{
                let strikes = snapshot.val() === null ? [] : snapshot.val()
                strikes.push(strike)
                let updates = {}
                updates[`rooms/${this.roomId}/game/strikesHistory`] = strikes
                this.database.ref().update(updates);
            })

        //prepare log
        const log = {
            type: "strike",
            log:[this.whoAmI,State.selectedStrikeSquares]
        }
        //send log
        let updates = {}
        this.database.ref(`rooms/${this.roomId}/game/logs`).once('value')
            .then((snapshot)=>{
                var logs = snapshot.val() === "" ? [] : snapshot.val()
                logs.push(log)
                updates[`rooms/${this.roomId}/game/logs`] = logs;
                this.database.ref().update(updates);
            })

        updates = {}
        updates[`rooms/${this.roomId}/game/currentTurn`] = this.whoAmI === 1 ? 2 : 1;
        this.database.ref().update(updates);


        this.setState(State)

        //if i won, shout out to DB
        if(this.didIWin()){
            updates = {}
            updates[`rooms/${this.roomId}/game/isGameOver`] = this.whoAmI
            this.database.ref().update(updates)
        }
    }

    deleteSimulateStrike(attacks){
        console.log("lol im out")
        var squares = []
        attacks.forEach((square)=>{
            try{
                document.getElementById(`enemy-canvas-square/${square[0]}-${square[1]}`).innerHTML= "";
                squares.push(square)

            }
            catch{
                console.log("out of range",square)
                //pass
            }
            console.log(1)

        })

        console.log(squares)
    }
    //PHASE 2

    //LOGS
    canvasPositionIfy(x,y){
        return `[${x+1}-${LETTERS[y]}] `
    }

    activateLogsListener(){
        this.database.ref(`rooms/${this.roomId}/game/logs`).on('value',(snapshot)=> {
            const logs = snapshot.val()
            const gameLogs = document.getElementById("game-logs")


            if(typeof logs !== "string")
            {
                const  log = logs[logs.length-1]
                let id = ""
                //prepare log
                switch (log.type) {
                    case "plane-set":
                        var message = `${log.log[0] === this.whoAmI ? "You " : "The enemy "} set up a plane. ${log.log[0] === this.whoAmI ? "You have" : "He has"} ${log.log[1]} more plane(s) to set up.`;
                        break;
                    case "strike":
                        let spots = ""
                        log.log[1].forEach((eachLog)=>{spots = spots + this.canvasPositionIfy(eachLog[0],eachLog[1])})
                        var message = `${log.log[0] === this.whoAmI ? "You " : "The enemy "} striked the following spot(s): ${spots}`
                        break;
                    default:
                        console.log("Log type unknown:", log.type)
                }
                //handle log..
                id = "log"+datify(new Date()).split("-")[1].replaceAll(":","")
                try{
                    gameLogs.insertAdjacentHTML('beforeend',`<p id="${id}">${message}</p>`)
                }
                catch{
                    return;
                }
                let HtmlLog = document.getElementById(id);
                setTimeout(()=>{
                    HtmlLog.style.transform = "translateY(0)";
                },100)

                setTimeout(()=>{
                    HtmlLog.style.transform = "translateY(-150%)"
                    HtmlLog.style.opacity = "0";
                    setTimeout(()=>{
                        HtmlLog.remove()
                    },1100)
                },8000)
            }

        })
    }
    //LOGS

    //AUX
    refreshDb(){

        var updates = {}

        updates[`rooms/${this.roomId}`] = {
            "chat" : "",
            "config" : {
                "attacks" : [ 0, 0 ],
                "canvasSize" : 10,
                "chat" : true,
                "fleet" : [1,0,0],
                "numberOfAirplanes" : 1
            },
            "game" : {
                "currentTurn":"1",
                "createdAt" : "3/10/2021-17:13:31:400",
                "strikesHistory":[],
                "gameStatus" : 101,
                "logs" : "",
                "planePositions" : "",
                "isGameOver":0
            }
        };
        this.database.ref().update(updates);
    }

    //RENDER
    render(){
        return(<>
            <section id="page-3">
                {
                    this.state.currentPage === 1 &&
                    <>
                    <WaitingPage/>
                    {/*<button onClick={()=>{this.refreshDb()}}>REFRESH DATABASE</button>*/}
                    </>
                }
                {
                    this.state.currentPage === 2 &&
                        <>
                    <NotAvailable/>
                    {/*<button onClick={()=>{this.refreshDb()}}>REFRESH DATABASE</button>*/}
                    </>
                }
                {
                    this.state.currentPage === 3 &&
                        <div id="game">
                            <div id="game-header">
                                <svg viewBox="0 0 735 389" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M68.6003 136.551C75.2463 140.896 87.4941 146.029 101.848 151.192C140.874 165.237 195.479 179.594 195.479 179.594C195.479 179.594 472.815 268.057 704.767 229.579C704.767 229.579 739.304 220.51 715.713 192.189C712.058 187.927 708.034 183.996 703.688 180.441L703.419 180.011C700.858 176.258 697.966 172.741 694.778 169.503C685.433 159.881 668.832 147.206 645.391 145.83L68.1561 107.857C68.1561 107.857 43.8795 120.357 68.6003 136.551Z" fill="#3F3D56"/>
                                    <path d="M188.868 121.257L91.3693 11.8081L37.9781 8.88109L68.1553 107.857C68.1553 107.857 184.181 135.516 188.868 121.257Z" fill="#3F3D56"/>
                                    <path d="M493.735 138.491L276.631 20.0434L237.427 19.2599L331.414 90.522L355.746 134.71L493.735 138.491Z" fill="#3F3D56"/>
                                    <path d="M101.847 151.192C140.874 165.237 195.479 179.594 195.479 179.594C195.479 179.594 472.814 268.057 704.767 229.579C704.767 229.579 739.304 220.51 715.713 192.189L715.524 192.568C715.524 192.568 662.695 212.956 438.301 188.515L101.847 151.192Z" fill="#278EA5"/>
                                    <path d="M139.559 157.986L26.0646 176.489L0.66471 167.604L73.4493 135.233C73.4493 135.233 152.197 136.479 139.559 157.986Z" fill="#3F3D56"/>
                                    <path d="M676.862 188.443C681.793 189.663 695.043 183.969 703.382 180.003C700.821 176.249 697.929 172.732 694.741 169.494C688.052 172.549 676.313 177.284 670.75 175.715C662.704 173.512 669.438 186.595 676.862 188.443Z" fill="#278EA5"/>
                                    <path d="M151.498 314.905L217.311 333.709L433.642 250.496L473.801 235.044L493.307 227.534C467.776 193.493 330.023 200.666 330.023 200.666C327.068 202.185 325.482 205.475 324.712 209.335C323.276 216.564 324.712 225.768 325.316 229.099C325.457 229.914 325.56 230.352 325.56 230.352L151.498 314.905Z" fill="#3F3D56"/>
                                </svg>

                                <p>{this.state.status}</p>

                               <AreYouSure text={this.state.areYouSureText}
                               btn1Text="Proceed"
                               btn1Event={()=>{this.confirmPlacePlane()}}
                               btn1Event2={()=>{this.closeAreYouSure(true,true)}}
                               btn2Text="Cancel"
                               btn2Event={()=>{this.closeAreYouSure()}}
                               btn2Event2={()=>{this.closeAreYouSure(false,true)}}
                               eventChoose={this.state.areYouSurePhase}/>

                                <svg viewBox="0 0 735 389" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M666.079 136.551C659.433 140.896 647.185 146.029 632.832 151.192C593.805 165.237 539.2 179.594 539.2 179.594C539.2 179.594 261.864 268.057 29.9118 229.579C29.9118 229.579 -4.62487 220.51 18.9661 192.189C22.6216 187.927 26.6457 183.996 30.9915 180.441L31.2605 180.011C33.8215 176.258 36.7133 172.741 39.9011 169.503C49.2463 159.881 65.8476 147.206 89.2884 145.83L666.523 107.857C666.523 107.857 690.8 120.357 666.079 136.551Z" fill="#3F3D56"/>
                                    <path d="M545.811 121.257L643.31 11.8081L696.701 8.88109L666.524 107.857C666.524 107.857 550.498 135.516 545.811 121.257Z" fill="#3F3D56"/>
                                    <path d="M240.944 138.491L458.048 20.0434L497.252 19.2599L403.265 90.522L378.933 134.71L240.944 138.491Z" fill="#3F3D56"/>
                                    <path d="M632.832 151.192C593.806 165.237 539.201 179.594 539.201 179.594C539.201 179.594 261.865 268.057 29.9122 229.579C29.9122 229.579 -4.6245 220.51 18.9665 192.189L19.1554 192.568C19.1554 192.568 71.9843 212.956 296.378 188.515L632.832 151.192Z" fill="#278EA5"/>
                                    <path d="M595.12 157.986L708.615 176.489L734.014 167.604L661.23 135.233C661.23 135.233 582.482 136.479 595.12 157.986Z" fill="#3F3D56"/>
                                    <path d="M57.8175 188.443C52.8865 189.663 39.636 183.969 31.2976 180.003C33.8587 176.249 36.7504 172.732 39.9382 169.494C46.627 172.549 58.3658 177.284 63.9287 175.715C71.9752 173.512 65.2412 186.595 57.8175 188.443Z" fill="#278EA5"/>
                                    <path d="M583.181 314.905L517.368 333.709L301.038 250.496L260.878 235.044L241.372 227.534C266.903 193.493 404.656 200.666 404.656 200.666C407.611 202.185 409.197 205.475 409.968 209.335C411.403 216.564 409.967 225.768 409.363 229.099C409.222 229.914 409.119 230.352 409.119 230.352L583.181 314.905Z" fill="#3F3D56"/>
                                </svg>
                            </div>

                            <div id="game-canvas-container">
                                {
                                    this.state.gamePhase === 1 &&
                                    <div className="game-canvas" id="setup-canvas">
                                        <div className="canvas-letters"></div>
                                        <div className="canvas-numbers"></div>
                                    </div>
                                }
                                {
                                    this.state.gamePhase ===2 &&
                                    <>
                                    <div className="game-canvas" id="my-canvas">
                                        <div className="canvas-letters"></div>
                                        <div className="canvas-numbers"></div>
                                    </div>

                                    <div className="game-canvas" id="enemy-canvas">
                                        <div className="canvas-letters"></div>
                                        <div className="canvas-numbers"></div>
                                    </div>

                                        <div id="legend-container" className={this.state.legend === true ? "" : "legend-closed"} onClick={()=>{
                                            let State = this.state
                                            State.legend = !State.legend
                                            this.setState(State)
                                        }}>
                                            <div><p>Legend</p></div>

                                            <div>
                                                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="3" fill="#CCED70"/></svg>
                                                <p>Missed</p>
                                            </div>

                                            <div>
                                                <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 22L10 14.5M17 7L10 14.5M10 14.5L3 7L17 22" stroke="#BE2D19" strokeWidth="2"/></svg>
                                                <p>Body hit</p>
                                            </div>

                                            <div>
                                                <svg width="25" height="25" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.1241 23.5027V27.8066H23.247H26.0051V23.5027L26.6719 23.3512L27.8237 22.5328L29.2785 21.1992L30.6728 19.411L31.3699 17.8046L31.6123 15.3798L31.3699 13.3188L30.2181 10.8637L28.3086 8.95426L26.0051 7.56003L23.4288 6.62044L21.6406 6.34766H19.5796L17.0336 6.86291L14.336 7.89343L12.2144 9.40889L10.4868 11.5002L9.57749 13.5613L9.39563 16.0163L9.78965 18.1683L10.7595 20.1384L12.3659 21.8054L14.0026 22.9268L15.1241 23.5027Z" stroke="#680606" strokeWidth="2"/><path d="M6.18268 8.43851L10.0623 12.5L11.305 10.4389L7.78907 7.07459L7.91031 6.98366L8.36495 6.55933L8.63773 5.89253L8.81959 4.98325L8.63773 4.19521L8.1831 3.43748L6.8798 3.04346L5.75835 3.28593L5.03093 4.04366L4.81876 4.68016V5.58944L4.24289 5.37727L3.06083 5.58944L2.18186 6.55933L2 7.92325L2.57588 9.01439L4.39443 9.59026L5.87959 9.13562L6.18268 8.43851Z" stroke="#680606" strokeWidth="2"/><path d="M34.3381 7.56941L30.6362 11.7934L29.3063 9.78758L32.6747 6.27561L32.5497 6.18996L32.0773 5.78552L31.7762 5.13102L31.5555 4.23037L31.7034 3.43526L32.1251 2.65873L33.4103 2.2092L34.5411 2.40337L35.3004 3.12923L35.5396 3.75604L35.5786 4.66448L36.1449 4.42782L37.3349 4.58912L38.2547 5.52044L38.4948 6.87531L37.9663 7.99013L36.1741 8.64344L34.6708 8.25289L34.3381 7.56941Z" stroke="#680606" strokeWidth="2"/><path d="M17.4576 26.4429V27.6552H19.4277M19.4277 27.6552V26.4429M19.4277 27.6552H21.3372M21.3372 27.6552V26.4429M21.3372 27.6552H23.277V26.4429" stroke="#680606"/><circle cx="16.2757" cy="18.1978" r="2.54598" fill="#680606"/><circle cx="24.7623" cy="18.3805" r="2.54598" fill="#680606"/><path d="M20.3977 20.8052L22.5501 24.5332H18.2453L20.3977 20.8052Z" fill="#680606"/><path d="M6.12203 27.5634L12.1233 21.4409L13.8812 22.8048L7.6678 28.9576L7.97089 29.1395L8.54677 29.9275L8.78925 31.1702L8.54677 32.2916L7.78904 33.0797L6.91007 33.2009L5.84924 33.0797L4.97027 32.5644L4.66718 31.5036L4.81873 30.4428H3.87914L3.06079 30.2306L2.27275 29.3213L2.03027 28.1999L2.27275 27.2603C2.53543 27.0178 3.08504 26.5268 3.18203 26.5026C3.27902 26.4783 4.01048 26.3712 4.36409 26.3207L5.3946 26.8057L6.12203 27.5634Z" stroke="#680606" strokeWidth="2"/><path d="M34.7643 27.9579L28.7631 21.8354L27.0051 23.1994L33.2186 29.3522L32.9155 29.534L32.3396 30.3221L32.0971 31.5647L32.3396 32.6862L33.0973 33.4742L33.9763 33.5955L35.0371 33.4742L35.9161 32.959L36.2192 31.8981L36.0676 30.8373H37.0072L37.8256 30.6251L38.6136 29.7159L38.8561 28.5944L38.6136 27.6548C38.3509 27.4124 37.8013 26.9213 37.7043 26.8971C37.6073 26.8729 36.8759 26.7658 36.5223 26.7152L35.4917 27.2002L34.7643 27.9579Z" stroke="#680606" strokeWidth="2"/></svg>
                                                <p>Head hit (dead)</p>
                                            </div>
                                        </div>
                                    </>
                                }


                            </div>

                            <div id="game-footer">
                                {
                                    this.state.toggleChat === true &&
                                    <div className="footerObj" id="game-chat">
                                    <div id="game-chat-header">
                                        <p>Chat</p>
                                        <button onClick={()=>{this.toggleChat()}}>
                                            <svg viewBox="0 0 51 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 43L25.5 23M48 3L25.5 23M25.5 23L3 3L48 43" stroke="#1F4287" strokeWidth="8"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div id="game-chat-texting">
                                        {this.state.reactMessages}
                                    </div>
                                    <div id="game-chat-textarea-container">
                                        <input placeholder="Write here" id="game-chat-input"/>
                                        <button onClick={()=>{this.sendMessage()}}>
                                            <svg viewBox="0 0 501 482" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M473 31.7201C461.462 16.1145 431.404 25.352 412 35.4999C325.833 58.8332 135.6 112.2 64 139C-7.60002 165.8 30.1666 183.167 58 188.5L246.657 249.5M473 31.7201C478.707 39.4382 479.883 53.233 473 75.9999C452.2 144.8 388 340.667 358.5 430C351.667 452 332.7 482.8 311.5 430C290.3 377.2 256.667 290.333 242.5 253.5L246.657 249.5M473 31.7201L246.657 249.5" stroke="#1F4287" strokeWidth="45"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                }
                                {
                                    this.state.toggleChat === false &&
                                    <div className="footerObj" id="game-chat-closed">
                                        <p>Chat</p>
                                        <button onClick={()=>{this.toggleChat()}}>
                                            <svg viewBox="0 0 341 335" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M105.5 130C81.1 80.7999 115.667 94.4999 136 107.5C195.5 126 315.7 163.3 320.5 164.5C325.3 165.7 282.5 196.333 260.5 211.5L325 275L276 320L210 257.5C197.833 279.833 172 323.6 166 320C158.5 315.5 136 191.5 105.5 130Z" stroke="#1F4287" strokeWidth="21"/>
                                                <rect x="16" y="163.945" width="54.0331" height="20.9166" rx="10.4583" transform="rotate(-43.1373 16 163.945)" fill="#1F4287"/>
                                                <rect x="128" y="53.9448" width="54.0331" height="20.9166" rx="10.4583" transform="rotate(-43.1373 128 53.9448)" fill="#1F4287"/>
                                                <rect x="0.350952" y="87.7593" width="54.0331" height="20.9166" rx="10.4583" transform="rotate(-0.828557 0.350952 87.7593)" fill="#1F4287"/>
                                                <rect x="111.401" y="0.187988" width="54.0331" height="20.9166" rx="10.4583" transform="rotate(90.515 111.401 0.187988)" fill="#1F4287"/>
                                                <rect x="34.1313" y="17.8169" width="54.0331" height="20.9166" rx="10.4583" transform="rotate(46.9917 34.1313 17.8169)" fill="#1F4287"/>
                                            </svg>
                                        </button>
                                    </div>
                                }

                                <div className="footerObj" id="game-menu-container">
                                    <div id="game-logs">
                                        <p id="invisibleLog">This is an invisi  ble log. If you see this, you are probably cool.</p>
                                    </div>
                                    <div id="game-menu">
                                        {
                                            this.state.gamePhase === 1 &&
                                                <>
                                                    {
                                                        this.state.remainingFleet[0] > 0 &&
                                                        <GameMenuButton title="Small plane" info={this.state.remainingFleet[0] + " left"} icon="menu-plane-1" event={()=>{this.changePlaneSize("small")}}/>
                                                    }
                                                    {
                                                        this.state.remainingFleet[1] > 0 &&
                                                        <GameMenuButton title="Medium plane" info={this.state.remainingFleet[1] + " left"} icon="menu-plane-2" event={()=>{this.changePlaneSize("medium")}}/>
                                                    }
                                                    {
                                                        this.state.remainingFleet[2] > 0 &&
                                                        <GameMenuButton title="Big plane" info={this.state.remainingFleet[2] + " left"} icon="menu-plane-3" event={()=>{this.changePlaneSize("big")}}/>
                                                    }
                                                    <GameMenuButton title="" info="" icon="menu-rotate-right"  event={()=>{this.menuRotateRight()}}/>
                                                    <GameMenuButton title="" info="" icon="menu-rotate-left" event={()=>{this.menuRotateLeft()}}/>
                                                </>
                                        }
                                        {
                                            this.state.gamePhase === 2 &&
                                                <>
                                                    <GameMenuButton title="Small strike" info="&infin; left" icon="menu-small-strike" event={()=>{this.changeStrikeSize("small")}}/>
                                                    {
                                                        this.state.remainingStrikes[0] > 0 &&
                                                        <GameMenuButton title="Medium strike" info={this.state.remainingStrikes[0] + " left"} icon="menu-medium-strike" event={()=>{this.changeStrikeSize("medium")}}/>
                                                    }
                                                    {
                                                        this.state.remainingStrikes[1] > 0 &&
                                                        <GameMenuButton title="Big strike" info={this.state.remainingStrikes[1] + " left"} icon="menu-big-strike" event={()=>{this.changeStrikeSize("big")}}/>
                                                    }
                                                </>

                                        }

                                    </div>
                                </div>
                                {
                                    this.state.gamePhase === 2 &&
                                    <div className="footerObj" id="statsContainer">
                                        <h4>Player status</h4>
                                        <p>Total number of shots: {this.state.statsTotalHits}</p>
                                        <p>Missed shots: {this.state.statsTotalHits - this.state.statsSuccessfulHits}</p>
                                        <p>Number of taken down airplanes: {this.state.statsTakenDownPlanes}</p>
                                        <p>Successful shots percentage: {this.state.statsTotalHits === 0 ? "0" : Math.round((this.state.statsSuccessfulHits * 100 / this.state.statsTotalHits) * 100) / 100}%</p>

                                    </div>
                                }


                                <div id="game-over-btns">
                                    <h2>The game is over.</h2>
                                    <Link to={`/planes-war/`}>
                                        <button>Go to Home Page</button>
                                    </Link>

                                    <Link to={`/planes-war/config/}`}>
                                        <button>Go to Configure page</button>
                                    </Link>


                                </div>


                            </div>
                        </div>

                }
                {/*<button onClick={()=>{this.refreshDb()}}>REFRESH DATABASE</button>*/}

            </section>
            </>)
    }
}

export default GamePage;