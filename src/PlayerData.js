import React, {Component} from 'react';

class PlayerData extends Component {

    constructor(props){

        super(props);
        this.state = {
            Data: <h3>Press "Request Data" to check for available players.</h3>,
            email: this.props.data.email,
            apikey: this.props.data.apikey,
            instance: 1
        };
    }

    onChange = (event) =>
    {
        if(event.target.value > 1)
        {
            this.setState({
                instance: event.target.value
            });
        }
        else
        {
            this.setState({
                instance: 1
            });
        }
    }

    storePlayers = (data) =>
    {
        console.log('data ', data.data);
        const displayToUser = data.data.map((player, index) => 
                                <div key = {index} style={{marginLeft: '30px', marginTop: '20px'}}>
                                            <h2>Name: {player.player_name}</h2>
                                            <h3>Position: {player.position}</h3>
                                            <h3>Starting bid: {player.startingBid}</h3>
                                            <h3>Buy Now Price: {player.buyNowPrice}</h3>
                                            <button>Bought</button>
                                            <br />
                                            <br />
                                            <button>Not Bought</button>
                                        </div> 
                            );
        this.setState(
                {Data: 
                    <div style={{display:'flex', justifyContent: 'center'}}>
                    {displayToUser}
                    </div>
                });
    }

    onSubmit = () =>
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

    render()
    {
        
        return(
            <div>
                <div style={{display:'flex', justifyContent: 'center'}}>
                <button type='submit' onClick={this.onSubmit}><h3>Request Data</h3></button>
                </div>
                <h4>Max no of players at once.</h4>
                <input style={{marginLeft: '10px'}} placeholder="curr players = 1" onChange={this.onChange} />
                {this.state.Data}  
            </div> 
        );
    }
}

export default PlayerData;