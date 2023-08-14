import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import MainPage from "./main-page/main-page";
import ConfigPage from "./config-page/config-page";
import GamePage from "./game-page/game-page";
import "./App.css";
import "./vars.css";

var URL_PREFIX = "planes-war"


class App extends Component{
  // eslint-disable-next-line
  constructor() {
    super();
    this.state = {
      activePage: 2
    }
  }

  // changePage = (id) =>{
  //   var State = this.state;
  //   const oldPage = State["activePage"];
  //   console.log("Old page:",oldPage,"| new page:",id)
  //   State.activePage = id;
  //   document.getElementById("page-"+oldPage).style.transform = "translateX(-100%)";
  //
  //   setTimeout(()=>{
  //     this.setState(State);
  //     document.getElementById("page-"+id).style.opacity = 0;
  //     setTimeout(()=>{
  //       document.getElementById("page-"+id).style.opacity = 1;
  //       document.body.scrollTop = 0; // For Safari
  //       document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  //     },200);
  //   },600)
  //
  // }

  render(){
    return(<>

      <Router>
        <Switch>
          <Route path={`/${URL_PREFIX}`} exact component={MainPage}/>
          <Route path={`/${URL_PREFIX}/config`} exact component={ConfigPage}/>
          <Route path={`/${URL_PREFIX}/game/:id`} exact component={GamePage}/>
        </Switch>
      </Router>
      </>)
  }
}

export default App;
