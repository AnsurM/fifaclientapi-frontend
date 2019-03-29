import React, { Component } from 'react';

class PlayerHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayData: <h3>Press "Request Data" to check for available players.</h3>,
            noPlayerDisplay: <h3></h3>,
            playerData: [],
            email: this.props.data.email,
            apikey: this.props.data.apikey,
            playersLeft: 0,
            instance: 0,
        }        
    }

    timeHandler(timeRem)
    {
        let Date1 = Math.floor( new Date().getTime()/1000 );
        let Date2 = timeRem;
        
        // console.log(Date1);
    
        var secdiff = Date2 - Date1; 
        var mindiff = Math.floor( secdiff / 60 );
        secdiff = secdiff % 60;
        var hourdiff = Math.floor( mindiff / 60 );
        mindiff = mindiff % 60;
        var daydiff = Math.floor( hourdiff / 24 );
        hourdiff = hourdiff % 24;
    
        // console.log('Day dif: ', daydiff);
        // console.log('Hour dif: ', hourdiff);
        // console.log('Min dif: ', mindiff);
    
        const diff = {
            days: daydiff,
            hours: hourdiff,
            minutes: mindiff
        };
    
        return diff;
    }
    

    storePlayerData = (data) => 
    {
        let prevData = this.state.playerData;
        console.log("Data is: ", data.data);
        let tempData = data.data.map(element => {
            const { player_name, player_rating, position, startingBid, buyNowPrice, tradeState, cardId, expires, tradeId} = element;
            let remTime = this.timeHandler(expires);
            console.log("Rem time is: ", remTime);
            //            let randomID = Math.floor(Math.random() * 16739589301);
            return {
                name: player_name,
                position: position,
                rating: player_rating,
                startingBid: startingBid,
                buyNowPrice: buyNowPrice,
                cardID: cardId,
                tradeID: tradeId,
                status: tradeState,
                time: {days: remTime.days,hours: remTime.hours, minutes: remTime.minutes}
            };
        });
        let newData = [...prevData, ...tempData];
        let notBought = 0;
        newData.forEach(element =>
            {
                if(element.status == "active")
                {
                    notBought++;
                }
                else
                {

                }
        })
        this.setState({playerData: newData, playersLeft: notBought},() => {
            this.displayPlayerData(newData);
        });
    }

    displayPlayerData = (myData) =>
    {
        // console.log("New data is: ", data);
        let that = this;
        const buttonStyle =
        {
            backgroundColor: "green",
            color: "yellow",
            width: "100px",
            margin: "10px 10px",
            height: "auto",
            padding: "10px",
            fontSize: "20px"
        };

        const cardStyle =
        {
            backgroundColor: "black",
            color: "orange",
            border: "2px solid green",
            width: "300px",
            margin: "20px 10px"
        };

        let toBeDisplayed = myData.map((player,index) =>
            {
                return (
                    <div id = {index} cardID = {player.cardID} tradeID = {player.tradeID} key = {index} style={cardStyle}>
                        <h2>Name: {player.name}</h2>
                        <h3>Rating: {player.rating}</h3>
                        <h3>Position: {player.position}</h3>
                        <h3>Starting bid: {player.startingBid}</h3>
                        <h3>Buy Now Price: {player.buyNowPrice}</h3>
                        <h3>Time Remaining:</h3>
                        <h3>{player.time.days} day(s), {player.time.hours} hours, {player.time.minutes} minutes.</h3>
                        <h3>Auction Status: {player.status}</h3>
                        <button style={buttonStyle} onClick = {(event) => this.onBuyClick(event,player.cardID)}>Bought</button>
                        <br />
                    </div> 
                );
        })
        
        // console.log("To be displayed: ", toBeDisplayed);
        this.setState({noPlayerDisplay: <h2>Updating....</h2>});

        this.setState({
            displayData: 
            <div style={{display:'flex', justifyContent: 'center'}}>
            {toBeDisplayed}
            </div>,
            noPlayerDisplay:
            <h3></h3>
        });
    }

    onBuyClick = (event,tradeid) => {
        console.log("Purchase requested for: ", tradeid);
        let notBought = this.state.playersLeft;

        let currPlayers = [...this.state.playerData];

        currPlayers.forEach((element, index) => {
            if(element.cardID == tradeid)
            {
                currPlayers[index].status="pending server response";
                this.checkBoughtStatus(tradeid, currPlayers, index, notBought);
            }
        })
    }    

    checkBoughtStatus = (playerID, currPlayers, index, notBought) =>
    {
        console.log("Checking purchase status for: ", playerID);

        fetch('http://localhost:3001/checkAuctionStatus',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            tradeID: playerID
            })
        })
        .then(response => response.json())             
        .then(data => {
            if(data.data)
            {
                if(data.data.tradeState)
                {
                    if(data.data.tradeState == 'closed')
                    {
                        alert(`Trade ID ${currPlayers[index].name} has been bought.`);
                        currPlayers[index].status = "Bought!";
                        currPlayers.splice(index,1);
                        // console.log("State Data: ", this.state.Data);
                        console.log("Curr Players: ", currPlayers);
                        if(notBought > 0)
                        {
                            notBought--;
                            console.log("Players to be bought: ", notBought);
                        }
                        this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));
                    }
                    else if(data.data.tradeState == 'expired')
                    {
                        // console.log(`You took too long buyg`);
                        alert(`This player (${currPlayers[index].name}) has expired.`);
                        currPlayers[index].status = "This player has expired.";
                        // currPlayers.splice(index,1);
                        // console.log("State Data: ", this.state.Data);
                        console.log("Curr Players: ", currPlayers);
                        // if(notBought > 0)
                        // {
                        //     notBought--;
                        //     console.log("Players to be bought: ", notBought);
                        // }
                        this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));
                    }
                    else if(data.data.tradeState == 'active')
                    {
                        // console.log(`You took too long buyg`);
                        currPlayers[index].status = "NOT Bought yet.";
                        // currPlayers.splice(index,1);
                        // console.log("State Data: ", this.state.Data);
                        console.log("Curr Players: ", currPlayers);
                        // if(notBought > 0)
                        // {
                        //     notBought--;
                        //     console.log("Players to be bought: ", notBought);
                        // }
                        this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));
                    }
                }
                else
                {                
                    console.log(`Trade ID ${playerID} has not been bought.`);
                    currPlayers[index].status = "NOT Bought!";
    //                currPlayers = currPlayers.splice(index-1,1);
                    // console.log("State Data: ", this.state.Data);
                    // console.log("Curr Players: ", currPlayers);
    //                notBought--;
                    this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));


                    console.log("Server response for status check: ", data);
                }
            }
            else
            {
                
            }
        })
        .catch(function (error) {
            console.log("Server error for status check: ", error);
        });

    }

    onChange = (event) =>
    {
        if(event.target.value > 0)
        {
            this.setState({
                instance: event.target.value
            });
        }
        else
        {
            this.setState({
                instance: 0
            });
        }
    }

    onKeyDown = (event) =>
    {
        if(event.key == "Enter")
        {
            this.onSubmit();
        }
    }    

    onSubmit = () =>
    {
        if(this.state.playersLeft <= 1)
        {

            fetch('http://localhost:3001/getData',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                email: this.state.email,
                apikey: this.state.apikey,
                instance: this.state.instance
                })
            })
            .then(response => response.json())             
            .then(data => {
                if(data.data)
                {
                    this.storePlayerData(data);
                }
                else
                {
                    console.log("Response: ", data.message);
                    this.setState({noPlayerDisplay: <h3>{`${data.message} \t`}</h3>})
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }        
        else
        {
            const players = this.state.playersLeft;
            alert(`Please buy the remaining ${players} player(s) before requesting new players.`);
        }
    }

    render() {
        return (
            <div tabIndex = {1} key = {this.state.playersLeft} onKeyDown = {this.onKeyDown} >
                <div style={{display:'flex', justifyContent: 'center'}}>
                <button type='submit' onClick={this.onSubmit}><h3>Request Data</h3></button>
                </div>
                <h4>Max no of players at once.</h4>
                <input style={{marginLeft: '10px'}}
                        placeholder={`Current Max Players: ${this.state.instance}`} 
                        value = {""}
                        onChange={this.onChange} />
                <div style={{display:'flex', justifyContent: "center", overflow: "auto", width: "90%", margin:"auto auto"}}>
                    {this.state.noPlayerDisplay}
                    {this.state.displayData}  
                </div>
            </div> 
        );
    }
}

export default PlayerHandler;