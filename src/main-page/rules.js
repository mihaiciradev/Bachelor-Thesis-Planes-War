import React, {Component} from 'react';
import './rules.css'

class Rules extends Component{
    render() {
        return(<>
            <div id="rules-container">
                <h2>Rules of the game</h2>
                <p>Place your planes strategically on the grid in order to mislead your opponent.</p>
                <p>Planes can be placed one next to another, but they cannot occupy the same place in the grid.</p>
                <p>Players take turns firing shots in attempt to hit the enemy fleet.</p>
            </div>
        </>)
    }
}

export default Rules;