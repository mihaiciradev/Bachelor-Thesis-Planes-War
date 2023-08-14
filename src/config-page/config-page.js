import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import Top from "./top";
import './config-page.css';
import BigButton from "../MutualComponents/BigButton";
import firebase from "firebase/app";
import "firebase/database";

Array.prototype.frequencies = function() {
    var l = this.length, result = {all:[]};
    while (l--){
        result[this[l]] = result[this[l]] ? ++result[this[l]] : 1;
    }
    // all pairs (label, frequencies) to an array of arrays(2)
    for (var r in result){
        if (result.hasOwnProperty(r) && r !== 'all'){
            result.all.push([ r,result[r] ]);
        }
    }
    return result;
};

function datify(date){
    var dbDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
    return dbDate;
}

class ConfigPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            canvasSize: 10,
            numberOfAirplanes:3,
            fleet:[3,0,0],
            attacks: [0,0],
            chat: true
        }
    }

    componentDidMount() {
        document.getElementById("chat-avilability-lever").addEventListener("click",()=>{
            var State = this.state;
            if(State.chat === true){
                document.getElementById("ball").style.transform="translateX(-60%)";
                document.getElementById("chat-avilability-lever").style.background = "#AD1515";
                document.getElementById("chat-availability-y-svg").style.opacity="0";
                document.getElementById("chat-availability-x-svg").style.opacity="1";
                State.chat = false;
            }
            else{
                console.log("heya")
                document.getElementById("ball").style.transform="translateX(60%)";
                document.getElementById("chat-avilability-lever").style.background = "#21E6C1";
                document.getElementById("chat-availability-y-svg").style.opacity="1";
                document.getElementById("chat-availability-x-svg").style.opacity="0";
                State.chat = true;
            }
            this.setState(State)
        })

        datify(new Date())
    }

    createRoom(state){
        var Configs = {
            config: state,
            game: {
                currentTurn:"1",
                createdAt: datify(new Date()),
                strikesHistory:[],
                gameStatus: 101,
                logs: "",
                planePositions:"",
                isGameOver:0
            },
            chat: ""
        }

        firebase.database().ref('rooms').push(Configs)
            .then((snapshot)=>{
                console.log("Room created: ",snapshot.key)
                this.props.history.push(`/planes-war/game/${snapshot.key}`)
            })

        // this.props.history.push(`/planes-war/game/-MnaMiPhsGkBRggwZlbH`)
    }

    lowerCanvasSize(){
        const min = 1
        var State = this.state;
        if(State.canvasSize >= min) {
            State.canvasSize = State.canvasSize - 1;
            this.setState(State);
            document.getElementById("config-canvas-size-canvas").style.width = (1.5 * State.canvasSize) + "vw";
            document.getElementById("config-canvas-size-text").innerText = State.canvasSize + " x " + State.canvasSize;
        }
    }

    upperCanvasSize(){
        const max = 25
        var State = this.state;
        if(State.canvasSize < max) {
            State.canvasSize = State.canvasSize + 1;
            this.setState(State);
            document.getElementById("config-canvas-size-canvas").style.width = (1.5 * State.canvasSize) + "vw";
            document.getElementById("config-canvas-size-text").innerText = State.canvasSize + " x " + State.canvasSize;
        }
    }

    lowerNumberOfAirplanes(){
        const MIN = 1
        var State = this.state
        if(State.numberOfAirplanes > MIN){
            State.numberOfAirplanes = State.numberOfAirplanes - 1
            State.fleet = [State.numberOfAirplanes,0,0]
            document.getElementById("config-number-of-airplanes-text").innerText = State.numberOfAirplanes;
            this.setState(State)
            this.restartPlanes(State)
        }
    }

    upperNumberOfAirplanes(){
        const MAX = 6
        var State = this.state
        if(State.numberOfAirplanes < MAX){
            State.numberOfAirplanes = State.numberOfAirplanes + 1
            State.fleet = [State.numberOfAirplanes,0,0]
            document.getElementById("config-number-of-airplanes-text").innerText = State.numberOfAirplanes;
            this.setState(State)
            this.restartPlanes(State)
        }
    }

    restartPlanes(State){
        for(let i=0 ; i<State.numberOfAirplanes ; i++) {
            this.lowerFleetAirplane(i)
            this.lowerFleetAirplane(i)
        }
    }

    lowerFleetAirplane(id){
        var State = this.state;
        const objId = "#configure-the-fleet-plane-id-"+id;
        if(!document.querySelector(objId))
            return;
        let lastValue = document.querySelector(`${objId}>.configure-the-fleet-plane-buttons>p`).innerHTML
        if(lastValue !== 'small'){
            if(lastValue==='medium'){
                State.fleet[1] -= 1;
                State.fleet[0] += 1;
                document.querySelector(objId+">.configure-the-fleet-plane-buttons>p").innerHTML = "small";
                document.querySelector(objId + ">.configure-the-fleet-plane-svg").innerHTML = "<svg viewBox=\"0 0 990 630\" fill=\"none\">                            <rect opacity=\"0.85\" width=\"990\" height=\"630\" fill=\"white\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"1.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"91.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"181.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"271.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"361.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"451.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"541.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"631.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"721.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"811.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect opacity=\"0.85\" x=\"901.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/>                            <rect x=\"454\" y=\"93\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"454\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"544\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"633\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"364\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"273\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"454\" y=\"273\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"453\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"544\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                            <rect x=\"363\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/>                        </svg>";
            }
            else{
                State.fleet[2] -= 1;
                State.fleet[1] += 1;
                document.querySelector(objId + ">.configure-the-fleet-plane-buttons>p").innerHTML = "medium";
                document.querySelector(objId + ">.configure-the-fleet-plane-svg").innerHTML = "<svg  viewBox=\"0 0 990 630\" fill=\"none\"><rect opacity=\"0.85\" width=\"990\" height=\"630\" fill=\"white\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect x=\"453\" y=\"93\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"543\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"633\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"723\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"364\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"273\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"182\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"273\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"544\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"364\" y=\"454\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/></svg>";
            }
            this.setState(State)
        }

    }

    upperFleetAirplane(id){
        var State = this.state;
        const objId = "#configure-the-fleet-plane-id-"+id;
        let lastValue = document.querySelector(`${objId}>.configure-the-fleet-plane-buttons>p`).innerHTML
        if(lastValue !== 'big'){
            if(lastValue==='small'){
                State.fleet[0] -= 1;
                State.fleet[1] += 1;
                document.querySelector(objId+">.configure-the-fleet-plane-buttons>p").innerHTML = "medium";
                document.querySelector(objId + ">.configure-the-fleet-plane-svg").innerHTML = "<svg  viewBox=\"0 0 990 630\" fill=\"none\"><rect opacity=\"0.85\" width=\"990\" height=\"630\" fill=\"white\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect x=\"453\" y=\"93\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"543\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"633\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"723\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"364\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"273\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"182\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"273\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"544\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"364\" y=\"454\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/></svg>";
            }
            else{
                State.fleet[1] -= 1;
                State.fleet[2] += 1;
                document.querySelector(objId + ">.configure-the-fleet-plane-buttons>p").innerHTML = "big";
                document.querySelector(objId + ">.configure-the-fleet-plane-svg").innerHTML = "<svg viewBox=\"0 0 990 630\" fill=\"none\"><rect opacity=\"0.85\" width=\"990\" height=\"630\" fill=\"white\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"1.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"91.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"181.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"271.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"361.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"451.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"1.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"91.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"181.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"271.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"361.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"451.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"541.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"631.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"721.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"811.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect opacity=\"0.85\" x=\"901.5\" y=\"541.5\" width=\"87\" height=\"87\" stroke=\"#757070\" stroke-width=\"3\"/><rect x=\"454\" y=\"94\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"544\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"633\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"723\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"813\" y=\"183\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"363\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"273\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"183\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"93\" y=\"184\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"273\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"454\" y=\"363\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"453\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"543\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"633\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"363\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/><rect x=\"273\" y=\"453\" width=\"84\" height=\"84\" fill=\"#FF800B\" stroke=\"#10FFE2\" stroke-width=\"6\"/></svg>";
            }
            this.setState(State)
        }
    }

    moreMediumAttacks(){
        var State = this.state
        if(State.attacks[0] < 50){
            State.attacks[0] = State.attacks[0] + 1
            this.setState(State)
        }
    }

    lessMediumAttacks(){
        var State = this.state
        if(State.attacks[0] > 0){
            State.attacks[0] = State.attacks[0] - 1
            this.setState(State)
        }
    }

    moreBigAttacks(){
        var State = this.state
        if(State.attacks[1] < 50){
            State.attacks[1] = State.attacks[1] + 1
            this.setState(State)
        }
    }

    lessBigAttacks(){
        var State = this.state
        if(State.attacks[1] > 0){
            State.attacks[1] = State.attacks[1] - 1
            this.setState(State)
        }
    }

    render() {
        //canvas size squares
        const canvasSizeSquares = []
        for(let i=0 ; i<this.state.canvasSize*this.state.canvasSize ; i++)
            canvasSizeSquares.push(<div className="config-canvas-size-canvas-square" key={"config-canvas-size-canvas-square-id-"+i}></div>)

        //number of airplanes
        const numberOfAirplanesPlanes = []
        for(let i=0 ; i<this.state.numberOfAirplanes ; i++)
            numberOfAirplanesPlanes.push(<div className="config-number-of-airplanes-planes-plane" key={"config-number-of-airplanes-planes-plane-id-"+i}><svg viewBox="0 0 241 197"><path d="M145.336 5H100.439V54.7194H4.8252V102.781H100.439V143.386H54.7107V192H188.293V143.386H145.336V102.781H235.684V54.7194H145.336V5Z" fill="#21E6C1" stroke="#278EA5" strokeWidth="9"/></svg></div>)

        //fleet
        const fleetTypes = []
        for(let i=0 ; i<this.state.numberOfAirplanes ; i++)
            fleetTypes.push(        <div className="configure-the-fleet-plane" key={"configure-the-fleet-plane-key-"+i} id={"configure-the-fleet-plane-id-"+i}>
                    <h3>#{i+1}</h3>
                    <div className="configure-the-fleet-plane-buttons">
                        <button onClick={()=>{this.upperFleetAirplane(i)}}>
                            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.0607 0.93934C12.4749 0.353553 11.5251 0.353553 10.9393 0.93934L1.3934 10.4853C0.807612 11.0711 0.807612 12.0208 1.3934 12.6066C1.97918 13.1924 2.92893 13.1924 3.51472 12.6066L12 4.12132L20.4853 12.6066C21.0711 13.1924 22.0208 13.1924 22.6066 12.6066C23.1924 12.0208 23.1924 11.0711 22.6066 10.4853L13.0607 0.93934ZM13.5 20L13.5 2H10.5L10.5 20H13.5Z" fill="black"/>
                            </svg>
                        </button>
                        <p>small</p>
                        <button onClick={()=>{this.lowerFleetAirplane(i)}}>
                            <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.0045 20.0674C11.594 20.6494 12.5437 20.6432 13.1257 20.0537L22.6098 10.4462C23.1918 9.85665 23.1856 8.90692 22.5961 8.32493C22.0065 7.74294 21.0568 7.74908 20.4748 8.33864L12.0445 16.8786L3.50458 8.44833C2.91502 7.86635 1.96529 7.87248 1.3833 8.46205C0.801314 9.05161 0.807453 10.0013 1.39701 10.5833L11.0045 20.0674ZM10.4419 1.00994L10.5583 19.0096L13.5582 18.9902L13.4419 0.990549L10.4419 1.00994Z" fill="black"/>
                            </svg>
                        </button>
                    </div>
                    <div className="configure-the-fleet-plane-svg">
                        <svg viewBox="0 0 990 630" fill="none">                            <rect opacity="0.85" width="990" height="630" fill="white"/>                            <rect opacity="0.85" x="1.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="1.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="91.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="181.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="271.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="361.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="451.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="1.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="91.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="181.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="271.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="361.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="451.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="541.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="631.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="721.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="811.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect opacity="0.85" x="901.5" y="541.5" width="87" height="87" stroke="#757070" strokeWidth="3"/>                            <rect x="454" y="93" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="454" y="183" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="544" y="183" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="633" y="183" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="364" y="183" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="273" y="183" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="454" y="273" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="453" y="363" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="544" y="363" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                            <rect x="363" y="363" width="84" height="84" fill="#FF800B" stroke="#10FFE2" strokeWidth="6"/>                        </svg>
                    </div>
                </div>)

        //summary
        const summary = [
            <p key="summary-canvas">&ndash;&emsp;The canvas size is {this.state.canvasSize}x{this.state.canvasSize} ({this.state.canvasSize * this.state.canvasSize} spots).</p>,
            <p key="summary-nrOfAirplanes">&ndash;&emsp;Each player has a fleet of {this.state.numberOfAirplanes} plane(s), as following:</p>
        ]
        const smallPlanes = this.state.fleet.frequencies()[1]
        const mediumPlanes = this.state.fleet.frequencies()[2]
        const bigPlanes = this.state.fleet.frequencies()[3]
        if(smallPlanes)
            summary.push(<p key="summary-smallPlanes">&bull;&emsp;{smallPlanes} small plane(s);</p>)

        if(mediumPlanes)
            summary.push(<p key="summary-mediumPlanes">&bull;&emsp;{mediumPlanes} medium plane(s);</p>)

        if(bigPlanes)
            summary.push(<p key="summary-bigPlanes">&bull;&emsp;{bigPlanes} big plane(s);</p>)

        summary.push(<p key="summary-munition">&ndash;&emsp;Each player has the following munition:</p>)
        summary.push(<p key="summary-smallShots">&bull;&emsp;Infinite small shots;</p>)
        if(this.state.attacks[0])
            summary.push(<p key="summary-mediumShots">&bull;&emsp;{this.state.attacks[0]} medium shot(s);</p>)

        if(this.state.attacks[1])
            summary.push(<p key="summary-bigShots">&bull;&emsp;{this.state.attacks[1]} big shot(s);</p>)

        summary.push(<p key="summary-chat">&ndash;&emsp;Chat is {this.state.chat === true ? "" : "not"} available</p>)

        return(<>
            <section id="page-2">
                <Top/>

                <BigButton text="Create room" event={()=>{this.createRoom(this.state)}}/>

                <div id="configs-container">
                    {/*Canvas size*/}
                    <div className="config">
                        <h3>Canvas size</h3>
                        <p>This is the board where the game will be held. You can adjust it as you like by making it smaller or bigger. Keep in mind that the bigger the board is, the harder it will be for you to hit your opponent.</p>
                        <div className="config-content" id="config-canvas-size">
                            <div id="config-canvas-size-buttons">
                                <button onClick={()=>{this.upperCanvasSize()}}>
                                    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.0607 0.93934C12.4749 0.353553 11.5251 0.353553 10.9393 0.93934L1.3934 10.4853C0.807612 11.0711 0.807612 12.0208 1.3934 12.6066C1.97918 13.1924 2.92893 13.1924 3.51472 12.6066L12 4.12132L20.4853 12.6066C21.0711 13.1924 22.0208 13.1924 22.6066 12.6066C23.1924 12.0208 23.1924 11.0711 22.6066 10.4853L13.0607 0.93934ZM13.5 20L13.5 2H10.5L10.5 20H13.5Z" fill="black"/>
                                    </svg>
                                </button>
                                <button onClick={()=>{this.lowerCanvasSize()}}>
                                    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0045 20.0674C11.594 20.6494 12.5437 20.6432 13.1257 20.0537L22.6098 10.4462C23.1918 9.85665 23.1856 8.90692 22.5961 8.32493C22.0065 7.74294 21.0568 7.74908 20.4748 8.33864L12.0445 16.8786L3.50458 8.44833C2.91502 7.86635 1.96529 7.87248 1.3833 8.46205C0.801314 9.05161 0.807453 10.0013 1.39701 10.5833L11.0045 20.0674ZM10.4419 1.00994L10.5583 19.0096L13.5582 18.9902L13.4419 0.990549L10.4419 1.00994Z" fill="black"/>
                                    </svg>
                                </button>
                            </div>
                            <p id="config-canvas-size-text">10 x 10</p>
                            <div id="config-canvas-size-canvas">
                                {canvasSizeSquares}
                            </div>
                        </div>
                    </div>

                    {/*Number of airplanes*/}
                    <div className="config">
                        <h3>Number of airplanes</h3>
                        <p>Choose the total number of aircrafts for each player.</p>
                        <div className="config-content" id="config-number-of-airplanes">
                            <div id="config-number-of-airplanes-buttons">
                                <button onClick={()=>{this.upperNumberOfAirplanes()}}>
                                    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.0607 0.93934C12.4749 0.353553 11.5251 0.353553 10.9393 0.93934L1.3934 10.4853C0.807612 11.0711 0.807612 12.0208 1.3934 12.6066C1.97918 13.1924 2.92893 13.1924 3.51472 12.6066L12 4.12132L20.4853 12.6066C21.0711 13.1924 22.0208 13.1924 22.6066 12.6066C23.1924 12.0208 23.1924 11.0711 22.6066 10.4853L13.0607 0.93934ZM13.5 20L13.5 2H10.5L10.5 20H13.5Z" fill="black"/>
                                    </svg>
                                </button>
                                <button onClick={()=>{this.lowerNumberOfAirplanes()}}>
                                    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0045 20.0674C11.594 20.6494 12.5437 20.6432 13.1257 20.0537L22.6098 10.4462C23.1918 9.85665 23.1856 8.90692 22.5961 8.32493C22.0065 7.74294 21.0568 7.74908 20.4748 8.33864L12.0445 16.8786L3.50458 8.44833C2.91502 7.86635 1.96529 7.87248 1.3833 8.46205C0.801314 9.05161 0.807453 10.0013 1.39701 10.5833L11.0045 20.0674ZM10.4419 1.00994L10.5583 19.0096L13.5582 18.9902L13.4419 0.990549L10.4419 1.00994Z" fill="black"/>
                                    </svg>
                                </button>
                            </div>

                            <p id="config-number-of-airplanes-text">3</p>

                            <div id="config-number-of-airplanes-planes">
                                {numberOfAirplanesPlanes}
                            </div>
                        </div>
                    </div>

                    {/*{Configure the fleet}*/}
                    <div className="config">
                        <h3>Configure the fleet</h3>
                        <p>You chose that each player will have {this.state.numberOfAirplanes} plane(s). Configure your fleet by chosing the size of each plane. Both players will have the same configurations. Choose wise!</p>
                        <div className="config-content" id="configure-the-fleet-container">
                            {fleetTypes}
                        </div>
                    </div>

                    {/*Modify the attacks*/}
                    <div className="config">
                        <h3>Plan your strikes</h3>
                        <p>Having a powerful gear increases the chances of hitting your opponent. Each player uses his special gear whenever he wants to. Both players will have the same gear at the begginning of the game.</p>
                        <div className="config-content" id="plan-your-strikes-container">
                            <div className="plan-your-strikes-strike">
                                <div className="plan-your-strikes-strike-atk">
                                    <p>Small attack (1 x 1)</p>
                                    <hr/>
                                    <div className="plan-your-strikes-strike-atk-times">
                                        <p>&infin; times</p>
                                    </div>
                                </div>
                                <div className="plan-your-strikes-strike-svg"><svg viewBox="0 0 630 450" fill="none"><rect opacity="0.85" x="1.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><path d="M342 252L315 225M288 198L315 225M315 225L342 198L288 252" stroke="#A51C2D" strokeWidth="6"/></svg></div>
                            </div>

                            <div className="plan-your-strikes-strike">
                                <div className="plan-your-strikes-strike-atk">
                                    <p>Medium attack (2 x 2)</p>
                                    <hr/>
                                    <div className="plan-your-strikes-strike-atk-times">
                                        <button onClick={()=>{this.lessMediumAttacks()}}>
                                            <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0)">
                                                    <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1923 12.0208 23.1923 12.6066 22.6066C13.1924 22.0208 13.1924 21.071 12.6066 20.4852L4.12132 12L12.6066 3.51466C13.1924 2.92886 13.1924 1.97916 12.6066 1.39336C12.0208 0.807558 11.0711 0.807558 10.4853 1.39336L0.93934 10.9393ZM20 10.5H2V13.5H20V10.5Z" fill="black"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0">
                                                        <rect width="24" height="20" fill="white" transform="translate(0 24) rotate(-90)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                        <p>{this.state.attacks[0]} times</p>
                                        <button onClick={()=>{this.moreMediumAttacks()}}>
                                            <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0)">
                                                    <path d="M19.0607 13.0607C19.6464 12.4749 19.6464 11.5251 19.0607 10.9393L9.5147 1.39344C8.9289 0.807655 7.9792 0.807655 7.3934 1.39344C6.8076 1.97922 6.8076 2.92897 7.3934 3.51476L15.8787 12L7.3934 20.4853C6.8076 21.0711 6.8076 22.0208 7.3934 22.6066C7.9792 23.1924 8.9289 23.1924 9.5147 22.6066L19.0607 13.0607ZM0 13.5L18 13.5L18 10.5L0 10.5L0 13.5Z" fill="black"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0">
                                                        <rect width="24" height="20" fill="white" transform="translate(20) rotate(90)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="plan-your-strikes-strike-svg"><svg viewBox="0 0 720 360" fill="none"><rect opacity="0.85" x="91.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="631.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="631.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="631.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="631.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><path d="M432 252L405 225M378 198L405 225M405 225L432 198L378 252" stroke="#A51C2D" strokeWidth="6"/><path d="M432 162L405 135M378 108L405 135M405 135L432 108L378 162" stroke="#A51C2D" strokeWidth="6"/><path d="M342 162L315 135M288 108L315 135M315 135L342 108L288 162" stroke="#A51C2D" strokeWidth="6"/><path d="M342 252L315 225M288 198L315 225M315 225L342 198L288 252" stroke="#A51C2D" strokeWidth="6"/></svg></div>
                            </div>

                            <div className="plan-your-strikes-strike">
                                <div className="plan-your-strikes-strike-atk">
                                    <p>Big attack (3 x 3)</p>
                                    <hr/>
                                    <div className="plan-your-strikes-strike-atk-times">
                                        <button onClick={()=>{this.lessBigAttacks()}}>
                                            <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0)">
                                                    <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1923 12.0208 23.1923 12.6066 22.6066C13.1924 22.0208 13.1924 21.071 12.6066 20.4852L4.12132 12L12.6066 3.51466C13.1924 2.92886 13.1924 1.97916 12.6066 1.39336C12.0208 0.807558 11.0711 0.807558 10.4853 1.39336L0.93934 10.9393ZM20 10.5H2V13.5H20V10.5Z" fill="black"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0">
                                                        <rect width="24" height="20" fill="white" transform="translate(0 24) rotate(-90)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                        <p>{this.state.attacks[1]} times</p>
                                        <button onClick={()=>{this.moreBigAttacks()}}>
                                            <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0)">
                                                    <path d="M19.0607 13.0607C19.6464 12.4749 19.6464 11.5251 19.0607 10.9393L9.5147 1.39344C8.9289 0.807655 7.9792 0.807655 7.3934 1.39344C6.8076 1.97922 6.8076 2.92897 7.3934 3.51476L15.8787 12L7.3934 20.4853C6.8076 21.0711 6.8076 22.0208 7.3934 22.6066C7.9792 23.1924 8.9289 23.1924 9.5147 22.6066L19.0607 13.0607ZM0 13.5L18 13.5L18 10.5L0 10.5L0 13.5Z" fill="black"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0">
                                                        <rect width="24" height="20" fill="white" transform="translate(20) rotate(90)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="plan-your-strikes-strike-svg"><svg viewBox="0 0 630 450" fill="none"><rect opacity="0.85" x="1.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="1.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="91.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="181.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="271.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="1.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="91.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="181.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="271.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="361.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="451.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><rect opacity="0.85" x="541.5" y="361.5" width="87" height="87" stroke="#21E6C1" strokeWidth="3"/><path d="M342 252L315 225M288 198L315 225M315 225L342 198L288 252" stroke="#A51C2D" strokeWidth="6"/><path d="M342 162L315 135M288 108L315 135M315 135L342 108L288 162" stroke="#A51C2D" strokeWidth="6"/><path d="M252 162L225 135M198 108L225 135M225 135L252 108L198 162" stroke="#A51C2D" strokeWidth="6"/><path d="M252 252L225 225M198 198L225 225M225 225L252 198L198 252" stroke="#A51C2D" strokeWidth="6"/><path d="M252 342L225 315M198 288L225 315M225 315L252 288L198 342" stroke="#A51C2D" strokeWidth="6"/><path d="M342 342L315 315M288 288L315 315M315 315L342 288L288 342" stroke="#A51C2D" strokeWidth="6"/><path d="M432 252L405 225M378 198L405 225M405 225L432 198L378 252" stroke="#A51C2D" strokeWidth="6"/><path d="M432 162L405 135M378 108L405 135M405 135L432 108L378 162" stroke="#A51C2D" strokeWidth="6"/><path d="M432 342L405 315M378 288L405 315M405 315L432 288L378 342" stroke="#A51C2D" strokeWidth="6"/></svg></div>
                            </div>
                        </div>
                    </div>

                    {/*Chat availability*/}
                    <div className="config">
                        <h3>Chat availability</h3>
                        <p>Sometimes, socialization might be the missing piece. Choose whether you want or not to be able to chat with your opponent.</p>
                        <div className="config-content" id="chat-avilability-container">
                            <div id="chat-avilability-lever">
                                <svg viewBox="0 0 129 123" fill="none" id="chat-availability-y-svg">
                                    <path d="M10.127 57.5405L43.1562 102L118.53 8" stroke="#278EA5" strokeWidth="25"/>
                                </svg>

                                <div id="ball"></div>

                                <svg viewBox="0 0 111 120" fill="none" id="chat-availability-x-svg">>
                                    <path d="M8.98224 112.5L55.405 60.25M101.828 8L55.405 60.25M55.405 60.25L8.98224 8L101.828 112.5" stroke="#731111" strokeWidth="22"/>
                                </svg>

                            </div>
                        </div>
                    </div>

                    {/*Summary*/}
                    <div className="summary">
                        <h3>Summary</h3>
                        {summary}
                    </div>
                </div>

                <BigButton text="Create room" event={()=>{this.createRoom(this.state)}}/>
            </section>
        </>)
    }
}

export default ConfigPage;