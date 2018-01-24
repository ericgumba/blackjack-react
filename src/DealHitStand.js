import React, { Component } from 'react'; 
import './App.css'; 

class DealHitStand extends Component{
 

    render(){ 

        return(
        <div className="btn-group btn-group-justified" role="group" aria-label="game">
            <div className="btn-group" role="group"> 
                <button onClick={this.props.deal} type="button" className="btn btn-info">Deal</button>
            </div>
            <div className="btn-group" role="group">
                <button onClick={this.props.hit} type="button" className="btn btn-success">Hit</button>
            </div>
            <div className="btn-group" role="group">
                <button onClick={this.props.stand} type="button" className="btn btn-danger">Stand</button>
            </div> 
        </div>

        )
    }
}

export default DealHitStand;