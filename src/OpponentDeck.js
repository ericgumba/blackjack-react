import React, { Component } from 'react'; 
import './App.css';

class OpponentDeck extends Component{
    constructor(props){
        super(props);

        console.log(this.props.oppD);
    }


    render(){
        return(
            <div className="Deck">   
            {this.props.oppD}
            </div>
 
        )
    }
}

export default OpponentDeck;

