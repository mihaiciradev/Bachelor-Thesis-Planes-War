import React, {Component} from 'react';

class AreYouSure extends Component{
    constructor(props) {
        super(props);

    }

    render(){
        return(<>
            <div id="areYouSure">
                <h2>{this.props.text} </h2>
                <div>
                    {
                        this.props.eventChoose === 1 &&
                            <>
                                <button onClick={()=>{this.props.btn1Event()}}>{this.props.btn1Text}</button>
                                <button onClick={()=>{this.props.btn2Event()}}>{this.props.btn2Text}</button>
                            </>
                    }

                    {
                        this.props.eventChoose === 2 &&
                        <>
                            <button onClick={()=>{this.props.btn1Event2()}}>{this.props.btn1Text}</button>
                            <button onClick={()=>{this.props.btn2Event2()}}>{this.props.btn2Text}</button>
                        </>
                    }

                </div>
            </div>
            </>)
    }
}

export default AreYouSure