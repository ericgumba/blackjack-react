import React, { Component } from 'react'; 
import './App.css'; 


class BettingChips extends Component{ 
    render(){ 

        
    return(
    <div>
    <h3 className = "bet"> BET </h3>
        <div className="grid-container">
            <button onClick={() => this.props.onClick(1)} value={1} >1</button>
            <button onClick={() => this.props.onClick(5)}>5</button>
            <button onClick={() => this.props.onClick(10)}>10</button>  
            <button onClick={() => this.props.onClick(25)}>25</button>
            <button onClick={() => this.props.onClick(50)}>50</button>
            <button onClick={() => this.props.onClick(100)}>100</button> 
            <button onClick={() => this.props.onClick(500)}> 500 </button>
            <button onClick={() => this.props.onClick(1000)}> 1000 </button>
            
            <button onClick={this.props.reset}> reset </button>

            money:{this.props.money}
            <div>
            betAmount:{this.props.betAmount}
            </div>
            
        </div> 
    </div>
    ) 
    };
}

export default BettingChips;