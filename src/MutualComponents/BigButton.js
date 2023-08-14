import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './bigButton.css';

class BigButton extends Component{
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    render() {
        return(<>
            {
                this.props.link &&
                <Link to={`/planes-war/${this.props.link}`}>
                    <button className="bigButton">{this.props.text}</button>
                </Link>
            }

            {
                this.props.event &&
                    <button className="bigButton" onClick={()=>{this.props.event()}}>{this.props.text}</button>
            }


        </>)
    }
}

export default BigButton;