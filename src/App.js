import React, { Component } from 'react'; 
import './App.css';
import OpponentDeck from './OpponentDeck';
import BettingChips from './BettingChips';
import DealHitStand from './DealHitStand';
import ComputerBrain from './ComputerBrain';

class App extends Component {
    constructor(props){
        super(props)

        this.suitMap = new Map([[0,'c'],[1,'h'], [2,'d'], [3,'s']])

        this.state = {
          deck: 52,
          bankRoll: 10000,
          betAmount: 0,
          inMiddleOfRound: false,
          endOfRound: false,
          playerCards: [],
          opponentCards: [],
          drawnCards: [], 
          opponentHandValue: 0,
          playerHandValue: 0,
          playerOverDrew: false,
          gameMessage: "Make a bet amount and press deal."

        };

        this.computerBrain = new ComputerBrain(this.state.opponentCards)
    }

 

    handleClick(betAmount){ 
        let oldMoney = this.state.bankRoll
        let newMoney = oldMoney - betAmount
        let bet = this.state.betAmount + betAmount
        

        if(newMoney < 0 || this.state.inMiddleOfRound) return;

        this.setState({
            bankRoll: newMoney,
            betAmount: bet,
        }); 
    };  
    containsDuplicates(hand, handTwo, card){ 
        let duplicate = false

        hand.forEach(element => {
            let [a,b] = card
            let [c,d] = element
            if( a === c && b === d){
                duplicate = true
            }
        })

        handTwo.forEach(element => {
            let [a,b] = card
            let [c,d] = element
            if(a === c && b === d){
                duplicate = true
            }
        })

        return duplicate
    }
     
    evaluateHand(hand){ 
        let value = []
        
        value = hand.map( (card, index) => {
            return card[1] > 10 ? 10 : card[1]; 
        } )

        value.sort((a, b) => b-a)
 

         return value.reduce( (acc, cur ) => {
             if(cur === 1){
                 return acc + 11 <= 21 ? acc + 11 : acc + cur
             }
             return acc + cur

             



         }, 0 )
 
        

    }  
     
    giveCard(handOne, handTwo){

        let [suit, number] = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 13 ) + 1]
 
         
        while(this.containsDuplicates(handOne, handTwo, [suit, number])){  
            [suit, number] = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 13 )+ 1]
        } 
        handOne.push([suit,number])
        
    }

    handleReset(){ 

        if(this.state.inMiddleOfRound) { return } 

        let oldMoney = this.state.bankRoll + this.state.betAmount
        
        this.setState({
            bankRoll: oldMoney,
            betAmount: 0,
        });
    }

    handleDeal(){  
        if(this.state.betAmount === 0){
            this.setState({gameMessage: "Please make a bet"})
        }

        if(this.state.inMiddleOfRound || this.state.betAmount === 0) { return } 
 

        let startingHand = this.state.playerCards
        let opponentStartingHand = this.state.opponentCards
        startingHand = []
        opponentStartingHand = []




        this.giveCard(startingHand, opponentStartingHand)
        this.giveCard(opponentStartingHand, startingHand)
        this.giveCard(startingHand, opponentStartingHand)
        this.giveCard(opponentStartingHand, startingHand)

        let value = this.evaluateHand(startingHand);
 
        this.setState({
            playerCards: startingHand,
            opponentCards: opponentStartingHand,
            inMiddleOfRound: true, 
            endOfRound: false,
            playerOverDrew: false,
            playerHandValue: value,
            gameMessage: "Let's play",

        });
        
    }

    //TODO: Bug in handlehit, which does not reset the betamount if player overdraws.
    handleHit(){ 


        if(this.state.betAmount === 0){
            this.setState({gameMessage: "Please make a bet"})
        }

        if(this.state.inMiddleOfRound === false || this.state.playerOverDrew) {return}

        let playerOverDrew = false
        let currentHand = this.state.playerCards
        let opponentHand = this.state.opponentCards
        let endOfRound = this.state.endOfRound
        let inMiddleOfRound = this.state.inMiddleOfRound
        let playerLosses = 0
        let gameMessage = this.state.gameMessage

        this.giveCard(currentHand, opponentHand)
 

        if(this.evaluateHand(currentHand) > 21){
            playerOverDrew = true;
            endOfRound = true;
            inMiddleOfRound = false;
            playerLosses = this.state.betAmount;
            gameMessage = `You lost: ${this.state.betAmount}`;
        }
 
 
        this.setState({
            playerCards: currentHand,
            playerHandValue: this.evaluateHand(currentHand),
            endOfRound: endOfRound,
            playerOverDrew: playerOverDrew,
            inMiddleOfRound: inMiddleOfRound,
            betAmount: this.state.betAmount - playerLosses,
            gameMessage: gameMessage,
        })
    }

    handleStand(){ 

        if(this.state.betAmount === 0){
            this.setState({gameMessage: "Please make a bet"})
        }

        
        if(this.state.inMiddleOfRound === false || this.state.playerOverDrew) {return;}

        let finalOpponentHand = this.state.opponentCards
        let finalPlayerHand = this.state.playerCards
        let newMoney
        let gameMessage = this.state.gameMessage

        while(this.evaluateHand(finalOpponentHand) < 17){
            this.giveCard(finalOpponentHand, finalPlayerHand)
        }

        let opponentValue = this.evaluateHand(finalOpponentHand)

        if(this.evaluateHand(finalOpponentHand) > 21 ) { 
            newMoney = this.state.bankRoll+ 2 * this.state.betAmount
            gameMessage = `you won ${this.state.betAmount}!`
        } else if(this.evaluateHand(finalPlayerHand) > this.evaluateHand(finalOpponentHand)){
            newMoney = this.state.bankRoll+ 2 * this.state.betAmount
            gameMessage = `you won ${this.state.betAmount}!`
        }
        else if(this.evaluateHand(finalPlayerHand) === this.evaluateHand(finalOpponentHand)) {
            newMoney = this.state.bankRoll + this.state.betAmount
            gameMessage = `draw!`
        } else if(this.evaluateHand(finalPlayerHand) < this.evaluateHand(finalOpponentHand)){
            newMoney = this.state.bankRoll
            gameMessage = `you lost ${this.state.betAmount}!`
        }

        this.setState({
            bankRoll: newMoney,
            inMiddleOfRound: false,
            endOfRound: true,
            betAmount: 0, 
            opponentCards: finalOpponentHand,
            opponentHandValue: opponentValue,
            gameMessage: gameMessage,
        })
    }
 


    render() {  
        let money = this.state.bankRoll
        let betAmount = this.state.betAmount
        const playerCards = this.state.playerCards
        let opponentDeck = this.state.opponentCards
        let opponentCards = []

        if(this.state.inMiddleOfRound){
            let desc
            opponentCards.push(<img src={require("./images/stack.png")} key="hidden" alt="" width='100'/> )

            let [suit, face] = opponentDeck[1]

          
            desc = this.suitMap.get(suit)
            desc = `${desc}${face}.png`


            opponentCards.push(<img src={require("./images/" + desc)} key="shown" alt="" width='100'/> )
        }

        if(this.state.endOfRound){ 
            opponentCards = opponentDeck.map((card, index) => { 
                let desc
                let [suit, face] = card
    
                desc = this.suitMap.get(suit)
                desc =  `${desc}${face}.png`
                return (
                    <img src={require("./images/" + desc)} key={index} alt="" width='100'/>   
                )
            })
        }
        const cards = playerCards.map((card, index) => { 
            let desc;

            let [suit, face] = card;

            desc = this.suitMap.get(suit); 
            desc =  `${desc}${face}.png`; 
            return (
                <img src={require("./images/" + desc)} key={index} alt="" width='100'/>   
            )
        })


        return ( 
        <div className = "App"> 
            <OpponentDeck oppD={opponentCards}/>  
            <div className="Player-cards"> 
                {cards}
            </div>
            <div>
                {this.state.playerHandValue}
                </div>
            <div>
                <BettingChips 
                onClick={(betAmount) => this.handleClick(betAmount)} 
                reset={() => this.handleReset()}
                money={money}
                betAmount={betAmount}
                />
            </div> 
            <div className="dealHitStand">
                <DealHitStand
                deal={() => this.handleDeal()}
                hit={() => this.handleHit()}
                stand={() => this.handleStand()}
                />
            </div>
            <div className="gameStatus">
                {this.state.gameMessage}
            </div> 
        </div>
        );
    }
}

export default App;

 