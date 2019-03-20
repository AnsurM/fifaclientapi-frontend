import React, {Component} from 'react';

class PlayerData extends Component {

    constructor(props){

        super(props);
        this.state = {
            Data: <h3>Press "Request Data" to check for available players.</h3>,
            email: this.props.data.email,
            apikey: this.props.data.apikey,
            playersLeft: 0,
            instance: 0,
            tradeID: [],
            ph: ""
        };
    }

    onBuyClick = (event, index) =>
    {
        let myData = {...this.state.Data};

        const myData1 = myData.props.children.map((player, myindex) =>
            {
               if(player.key == index)
               {
                   myData.props.children.splice(myindex,1)
                   return player;
               }
            });
//            this.setState({Data: <h2>Getting data..</h2>, playersLeft: 0});
            this.setState({Data: myData, playersLeft: myData.props.children.length});
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

    async storePlayers(data)
    {
        let that = this;
        const buttonStyle =
        {
            backgroundColor: "green",
            color: "yellow",
            width: "60%",
            height: "auto",
            padding: "10px",
            fontSize: "20px"
        };

        const cardStyle =
        {
            backgroundColor: "black",
            color: "orange",
            border: "2px solid green",
            padding: "20px",            
            marginLeft: '30px', 
            marginTop: '20px'
        };

        if(data.data)
        {
                // console.log('data ', data.data);
                const displayToUser = data.data.map((player, index) => 
                                        <div key = {index} style={cardStyle}>
                                                    <h2>Name: {player.player_name}</h2>
                                                    <h3>Rating: {player.player_rating}</h3>
                                                    <h3>Position: {player.position}</h3>
                                                    <h3>Starting bid: {player.startingBid}</h3>
                                                    <h3>Buy Now Price: {player.buyNowPrice}</h3>
                                                    <h3>Time Remaining:</h3>
                                                    <h3>{data.days} day(s), {data.hours} hours, {data.minutes} minutes.</h3>
                                                    <button style={buttonStyle} onClick = {(event) => this.onBuyClick(event,index)}>Bought</button>
                                                    <br />
                                        </div> 
                                    );
                const myTradeIDs = await data.data.map((player,index) =>
                {
                    return player.tradeId;
                })
                that.setState(
                    {
                        Data: 
                            <div style={{display:'flex', justifyContent: 'center'}}>
                            {displayToUser}
                            </div>,
                            tradeID: myTradeIDs,
                            playersLeft: displayToUser.length}
                        );
        }
        else
        {
//            console.log(data);
            this.setState({
                Data: <div>
                        <br />
                        <h2>Server response: {data.message}</h2>
                      </div>
            })
        }
        this.setState({ph: ""});
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
        if(this.state.playersLeft == 0)
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
                this.storePlayers(data);
            })
            .catch(function (error) {
                console.log(error);
                });
        }        
        else
        {
            const tempData = this.state.Data;
            const players = this.state.playersLeft;
            alert(`Please buy the remaining ${players} player(s) before requesting new players.`);

            this.setState({Data: <h2>Getting data..</h2>, playersLeft: 0});
            this.setState({Data: tempData, playersLeft: players});
        }
    }

    render()
    {
        // console.log('Data : ', this.state.Data);   
        return(
            <div tabIndex = {1} key = {this.state.playersLeft} onKeyDown = {this.onKeyDown}>
                <div style={{display:'flex', justifyContent: 'center'}}>
                <button type='submit' onClick={this.onSubmit}><h3>Request Data</h3></button>
                </div>
                <h4>Max no of players at once.</h4>
                <input style={{marginLeft: '10px'}}
                        placeholder={`Current Max Players: ${this.state.instance}`} 
                        value = {""}
                        onChange={this.onChange} />
                {this.state.Data}  
            </div> 
        );
    }
}

export default PlayerData;