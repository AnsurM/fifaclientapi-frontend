import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import Sound from 'react-sound';
import Notifications, {notify} from 'react-notify-toast';
import ReactLoading from 'react-loading';
import ReactCountdownClock from 'react-countdown-clock';
import constants from './constants';


class PlayerHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayData: <h3></h3>,
            buttonText: "Request Players.",
            searching: false,
            noPlayerDisplay: <h3>Press "Request Data" to check for available players.</h3>,
            playerData: [],
            email: this.props.data.email,
            apikey: this.props.data.apikey,
            isAdmin: this.props.data.email == 'admin@themarket.org' ? true : false,

            billingRate: "Fetching Billing Rate. Please refresh if it doesn't update in 10 seconds.",
            playersLeft: 0,
            instance: "",
            maxPlayers: 2,
            visible: false,
            cardid: 0,
            playSoundStatus: "STOPPED"
        }        
    }

    openModal = (cancelid) => {
        this.setState({
            visible : true,
            cardid: cancelid
        });
    }

    clickModalOK = () =>
    {           
        fetch(constants.url + '/cancelAuction',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            cancelId: this.state.cardid,
            })
        })
        .then(response => response.json())             
        .then(data => {
//            console.log("Cancel request returned: ", data.msg);
            if(data.ret == 0)
            {
                notify.show(("The purchase was successfully cancelled."), "error", 6000);
            }
            else
            {
                notify.show(`The purchase cannot be cancelled. Reason: ${data.msg}`, "warning", 6000);
                // this.setState({noPlayerDisplay: <h3>{`${data.message} \t`}</h3>})
            }

            let currPlayers = [...this.state.playerData];

            currPlayers.forEach((element,index) =>
            {
                let tempID = this.state.cardid;
                if(element.cardID == tempID)
                {
                    currPlayers.splice(index, 1);
                }
            });

            this.setState(
                {cardid: 0, playerData: currPlayers, visible: false},
                () => this.displayPlayerData(currPlayers)                
                );
        })
        .catch(function (error) {
            console.log(error);
            this.setState({cardid: 0, visible: false});
        });
    }

    closeModal = () => {
        this.setState({
            cardid: 0,
            visible : false
        });
    }

    timeHandler(timeRem)
    {
        let Date1 = Math.floor( new Date().getTime()/1000 );
        let Date2 = timeRem;
        let Date3 = Date1 + 300;

        var timeToExpire = Date3 - Date1;
        
        var secdiff = Date2 - Date1; 
        console.log(("Seconds to expire: ", secdiff));
        var mindiff = Math.floor( secdiff / 60 );
        secdiff = secdiff % 60;
        var hourdiff = Math.floor( mindiff / 60 );
        mindiff = mindiff % 60;
        var daydiff = Math.floor( hourdiff / 24 );
        hourdiff = hourdiff % 24;
        
        const diff = {
            days: daydiff,
            hours: hourdiff,
            minutes: mindiff,
            timeToExp: timeToExpire
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
                expires: (Math.floor( new Date().getTime()/1000)) + 270,
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
            width: "80px",
            margin: "10px 10px",
            height: "auto",
            padding: "5px",
            fontSize: "20px"
        };

        const cancelButtonStyle =
        {
            backgroundColor: "red",
            color: "white",
            width: "80px",
            margin: "10px 10px",
            height: "auto",
            padding: "5px",
            fontSize: "20px"
        };

        const cardStyle =
        {
            backgroundColor: "#3A4245",
            color: "chartreuse",
            border: "2px solid gold",
            width: "250px",
            margin: "10px 10px"
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
                        <h3>Listing Time:</h3>
                        <h3>{player.time.days} day(s), {player.time.hours} hours, {player.time.minutes} minutes.</h3>
                        <h3>Player Expires:</h3>
                        <div style={{marginLeft: "20px"}}>
                        <ReactCountdownClock seconds= {player.expires - (Math.floor( new Date().getTime()/1000))}
                        color="darkorange"
                        alpha={1}
                        timeFormat="hms"
                        size={90}
                        onComplete={() => notify.show(("The player " + `${player.name}` + " has expired."),("error"),(5000))} />
                        </div>
                        <h3>Auction Status: {player.status}</h3>
                        <div>
                        <button style={buttonStyle} onClick = {(event) => this.onBuyClick(event,player.cardID)}>Bought</button>
                        <button style={cancelButtonStyle} onClick = {(event) => this.onCancelClick(event,player.cardID)}>Cancel</button>
                        </div>
                    </div> 
                );
        })
        
        // console.log("To be displayed: ", toBeDisplayed);
        this.setState({noPlayerDisplay: <h2>Updating....</h2>});

        this.setState({
            displayData: 
            <div style={{display:'inline-flex', justifyContent: 'center'}}>
            {toBeDisplayed}
            </div>,
            noPlayerDisplay:
            <h3></h3>
        });
    }

    onCancelClick = (event, tradeid) =>
    {
        console.log("Cancel requested for :", tradeid);
//        <input type="button" value="Open" onClick={() => this.openModal()} />
        this.openModal(tradeid);
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

        fetch(constants.url + '/checkAuctionStatus',{
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
                        notify.show(("CONGRATULATIONS! " + `${currPlayers[index].name}` + " has been bought!."),("success"), (5000));
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
                        notify.show(("Unfortunately, listing for " + `${currPlayers[index].name}` + " has EXPIRED and was not bought."),("error"),(8000));
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
                        notify.show((`${currPlayers[index].name}` + " has not been bought yet!."),("warning"), (8000));
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
            }
            else
            {                
                console.log(`Trade ID ${playerID}` + " has not been bought.");
                notify.show(("An error occured while checking status.\nPlease retry after 2 minutes."), ("warning"), (7500));
                currPlayers[index].status = "Please re-click me after 2 minutes";
                this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));
                console.log("Server response for status check: ", data);
            }
    })
        .catch(function (error) {
            console.log("Server error for status check: ", error);
            notify.show(("An error occured while checking status.\nPlease retry after 2 minutes."), ("warning"), (7500));
            currPlayers[index].status = "Please re-click me after 2 minutes";
            this.setState({playerData: currPlayers, playersLeft: notBought}, () => this.displayPlayerData(currPlayers));
    });

    }

    onChange = (event) =>
    {
        if(event.target.value > 0)
        {
            if(event.target.value > 4)
                this.setState({
                    instance: 4,
                    maxPlayers: 4
                });
            else
            {
                this.setState({
                    instance: event.target.value,
                    maxPlayers: event.target.value
                });
            }
        }
        else
        {
            this.setState({
                instance: "",
                maxPlayers: 2
        });
        }
    }

    onKeyDown = (event) =>
    {
        if(event.key == "Enter")
        {
            this.onSubmit();
        }
        else if(event.key == "Shift")
        {
            this.setState({playSoundStatus: "STOPPED"});
        }
    }

    getDataFromServer = () =>
    {
        let max = this.state.maxPlayers;
        if(this.state.playersLeft < max)
        {
            if(this.state.searching)
            {
//                let myEmail = this.state.isAdmin ? "waqar@gmail.com" : this.state.email;
                setTimeout(() => {
                    fetch(constants.url + '/getData',{
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
                            if(this.state.playersLeft < max)
                            {
                                this.setState({playSoundStatus: "PLAYING"});
                                this.storePlayerData(data);
                                this.getDataFromServer();
                            }
                            else
                            {                                
                                this.setState({playSoundStatus: "PLAYING", buttonText: "Request Players.", searching: false});
                                this.storePlayerData(data);
                            }
                        }
                        else
                        {
                            console.log("Response: ", data.message);
                            this.getDataFromServer();
                            //                    this.setState({noPlayerDisplay: <h3>{`${data.message} \t`}</h3>})
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });    
                }, 400);
            }
        }        
        else
        {
//            const players = this.state.playersLeft;
//            alert(`Please buy the remaining ${players} player(s) before requesting new players.`);
              this.setState({playSoundStatus: "PLAYING", buttonText: "Request Players.", searching: false});
//              this.storePlayerData(data);
        }
    }
    
    onSubmit = () =>
    {
        if(this.state.buttonText == "Stop Requesting Players.")
        {
            this.setState({
                buttonText: "Request Players.", 
                noPlayerDisplay: <h3>Press "Request Players" to search for players....</h3>, 
                searching: false
            });
        }
        else{
            this.setState({
            buttonText: "Stop Requesting Players.", 
            noPlayerDisplay: <h3>Searching for players....</h3>, 
            searching: true},
            () => this.getDataFromServer()
            );
        }
    }

    componentDidMount() {
        
        fetch(constants.url + '/pricefetch')
        .then(response => response.json())
        .then(data => {
//            console.log("Data for todays rate is: ", data);
            if(data.billingRate)
            {
                const billRate = data.billingRate;
//                const billRate = 0.080;
                let newRate = billRate - 0.003;
                newRate = Math.floor(newRate * 100 * 158 * 0.52);
                this.setState({billingRate: `PKR ${newRate} / 100K`});
                //per 1000 coins = 0.052 euro;
                //per 100,000 = 5.2 euro;
                //5.2 euro in pkr = 820.0 rs
                //give client 425.0 rs.
                // we get 395 rs per 100k.


                // STEPS FOR CALCULATION
                // newRate = rate - 0.003;
                // newRate = newRate * 100; (per 100K)
                // newRate = newRate * 158; (per 100K in PKR).
                // showToClient = newRate * 0.52; (per 100K in PKR - our profit)
                // display = "Today's rate is {showToClient} per 100K";


            }
        })
        .catch(err => console.log("Error while fetching rate from server."));
    }
    
    onClickSignOut = () => {

        let email = this.state.email;

        fetch(constants.url + '/signout',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            email: email
            })
        })
        .then(response => response.json())             
        .then(data => {
            this.props.updateRoute("Login");
        })
        .catch(err => console.log("Err sending logout req"));
    }

    onClickTable = () =>
    {
        this.props.updateRoute("Table");
    }

    signOutAllUsers = () =>
    {
        fetch(constants.url + '/supersignout',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            email: this.state.email
            })
        })
        .then(response => response.json())             
        .then(data => {
            if(data.message == "SUCCESS")
            {
                alert("All users logged out.");
            }
            else
            {
                alert("Error logging users out.");
            }
        })
        .catch(err => console.log("Err processing all log out req"));

    }

    render() {
        let isAdminStatus = this.state.isAdmin;
        console.log("isAdmin :", isAdminStatus);
        let superLogOut = null;
        if(isAdminStatus)
        {
            superLogOut = 
            <div>
            <button 
            style = {{backgroundColor: "black", color:"white", borderColor: "gold", 
                  width: "auto", height: "auto", padding: "8px", margin: "30px 50px"}}                        
            onClick={this.onClickTable}>Records</button>
            <button 
            style = {{backgroundColor: "black", color:"red", borderColor: "gold", 
                  width: "auto", height: "auto", padding: "8px", margin: "30px 50px"}}                        
            onClick={this.signOutAllUsers}>Log ALL USERS Out</button>
            </div>;
        }

        return (
            <div>
            <Notifications />
            <div style={{display:"flex", width: "100%"}}  tabIndex = {1} key = {this.state.playersLeft} onKeyDown = {this.onKeyDown} >
                    
                    <div style = {{display:"flex-start", width: "20%"}} id = "ALL NON-PLAYER INFO">

                    <div style={{display:'flex', justifyContent: 'center'}}>
                    <h3 style ={{color: "chartreuse"}}>Today's rate is: {this.state.billingRate}</h3>
                    </div>
                    
                    <div>
                    <h4>Max no of players at once: </h4>
                    <input style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                    backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                   width: "100px", height: "25px"
                            }}
                        placeholder= "default is 2" 
                        value = {this.state.instance}
                        onChange={this.onChange} ></input>
                    </div>

                    <div>
                    <button 
                    style={{backgroundColor: "#3A4245", color:"gold", borderColor: "gold",  
                    width: "120px", height: "auto", padding: "8px", margin: "50px 50px"}}
                    onClick = {() => this.setState({playSoundStatus: "STOPPED"})}>
                    STOP SOUND
                    </button>
                    <button 
                    onClick={this.onSubmit}
                    // #3A4245
                    style = {{backgroundColor: "#3A4245", color:"chartreuse", borderColor: "gold", 
                              width: "150px", height: "auto", padding: "4px", margin: "5px 50px"}}
                    >
                    {this.state.buttonText.toUpperCase()}
                    </button>
                    </div>
                    <div>
                        <button 
                        style = {{backgroundColor: "black", color:"red", borderColor: "gold", 
                              width: "auto", height: "auto", padding: "8px", margin: "30px 50px"}}                        
                        onClick={this.onClickSignOut}>Log Out</button>
                        {superLogOut}
                    </div>
                    </div>



                    <div id="PLAYER DATA" style = {{display:"flex-end", width: "80%"}}>
                        <div style = {{width: "100%", overflowX: "auto"}}>
                            <div style={{marginLeft: "45%"}}>
                            {this.state.searching ? <h3><ReactLoading type="spin" color="chartreuse"/></h3> : null}  
                            </div>
                            {this.state.displayData}
                            <br />
                            {this.state.noPlayerDisplay}
                        </div>
                    </div>

            </div>

            <div id="MODAL AND SOUND">
                    <section>
                        {/* <input type="button" value="Open" onClick={() => this.openModal()} /> */}
                        <Modal 
                            visible={this.state.visible}
                            width="400"
                            height="300"
                            effect="fadeInUp"
                            style = {{backgroundColor: "cadetblue", color: "gold",
                                    border: "5px solid red", borderSize: "10px"
                            }}
                            // onClickAway={() => this.closeModal()}
                        >
                            <div>
                                <h1>Cancel Purchase</h1>
                                <p>Are you sure you want to cancel the purchase of this player? Click YES to proceed, or NO to go back.</p>
                                <br />
                                <button onClick = {this.clickModalOK} 
                                style={{backgroundColor: "red", color: "white", width: "100px", height: "50px"}}>
                                YES
                                </button>
                                <br />
                                <br />
                                <button onClick = {this.closeModal} 
                                style={{backgroundColor: "green", color: "white",width: "100px", height: "50px"}}>
                                NO
                                </button>
                            </div>
                        </Modal>
                    </section>
                    <Sound
                    url="https://www.soundjay.com/button/beep-08b.mp3"
                    playStatus={this.state.playSoundStatus}
                    playFromPosition={0 /* in milliseconds */}
                    volume={100}
                    autoLoad={true}
                    loop={true}
                    // onLoading={this.handleSongLoading}
                    // onPlaying={this.handleSongPlaying}
                    // onFinishedPlaying={this.handleSongFinishedPlaying}
                    />
            </div> 

            </div>
        );
    }

}

export default PlayerHandler;




    // render1() {
    //     return (
    //         <div tabIndex = {1} key = {this.state.playersLeft} onKeyDown = {this.onKeyDown} >
    //                 <div style={{display:'flex', justifyContent: 'center'}}>
    //                 <h3 style ={{color: "chartreuse"}}>Today's rate is: {this.state.billingRate}</h3>
    //                 </div>
    //                 <div>
    //                 <h4>Max no of players at once: </h4>
    //                 <input style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
    //                                 backgroundColor: "#3A4245", color: "gold", textAlign: "center",
    //                                width: "50px", height: "20px"
    //                         }}
    //                     placeholder= "" 
    //                     value = {`${this.state.instance}`}
    //                     onChange={this.onChange} ></input>
    //                 </div>
    //                 <div>
    //                 {this.state.noPlayerDisplay}
    //                 </div>
    //                 <div>
    //                 <button 
    //                 style={{backgroundColor: "#3A4245", color:"gold", borderColor: "gold",  
    //                 width: "auto", height: "auto", padding: "8px", margin: "0px 50px"}}
    //                 onClick = {() => this.setState({playSoundStatus: "STOPPED"})}>
    //                 STOP SOUND
    //                 </button>
    //                 <button 
    //                 onClick={this.onSubmit}
    //                 // #3A4245
    //                 style = {{backgroundColor: "#3A4245", color:"chartreuse", borderColor: "gold", 
    //                           width: "auto", height: "auto", padding: "8px", margin: "0px 50px"}}
    //                 >
    //                 {this.state.buttonText.toUpperCase()}
    //                 </button>
    //                 </div>
    //                 <div style={{display:'flex', justifyContent: "center", overflow: "auto", width: "90%", margin:"auto auto"}}>
    //                 <div>
    //                 {this.state.displayData}  
    //                 </div>
    //                 </div>
    //                 <section>
    //                     {/* <input type="button" value="Open" onClick={() => this.openModal()} /> */}
    //                     <Modal 
    //                         visible={this.state.visible}
    //                         width="400"
    //                         height="300"
    //                         effect="fadeInUp"
    //                         style = {{backgroundColor: "cadetblue", color: "gold",
    //                                 border: "5px solid red", borderSize: "10px"
    //                         }}
    //                         // onClickAway={() => this.closeModal()}
    //                     >
    //                         <div>
    //                             <h1>Cancel Purchase</h1>
    //                             <p>Are you sure you want to cancel the purchase of this player? Click YES to proceed, or NO to go back.</p>
    //                             <br />
    //                             <button onClick = {this.clickModalOK} 
    //                             style={{backgroundColor: "red", color: "white", width: "100px", height: "50px"}}>
    //                             YES
    //                             </button>
    //                             <br />
    //                             <br />
    //                             <button onClick = {this.closeModal} 
    //                             style={{backgroundColor: "green", color: "white",width: "100px", height: "50px"}}>
    //                             NO
    //                             </button>
    //                         </div>
    //                     </Modal>
    //                 </section>
    //                 <Sound
    //                 url="https://www.soundjay.com/button/beep-08b.mp3"
    //                 playStatus={this.state.playSoundStatus}
    //                 playFromPosition={0 /* in milliseconds */}
    //                 volume={100}
    //                 autoLoad={true}
    //                 loop={true}
    //                 // onLoading={this.handleSongLoading}
    //                 // onPlaying={this.handleSongPlaying}
    //                 // onFinishedPlaying={this.handleSongFinishedPlaying}
    //                 />
    //         </div> 
    //     );
    // }
