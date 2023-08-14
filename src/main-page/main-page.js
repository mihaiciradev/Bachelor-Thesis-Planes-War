import React, {Component} from 'react';
import Parallax from "./parallax";
import BigButton from "../MutualComponents/BigButton";
import Perks from "./perks";
import Rules from "./rules";

class MainPage extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.match)
    }

    render() {
        return(<>
            <section id="page-1">
                <Parallax/>
                <BigButton text="Configure room" link="config/"/>
                <Perks/>
                <Rules/>
            </section>
            </>)
    }
}

export default MainPage;