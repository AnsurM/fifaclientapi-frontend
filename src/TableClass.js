import React, {Component} from 'react';

// var TableComponent = React.createClass({

  // Example Data
  var tableData = {
    columns: ['Service', 'Cost/Unit', 'Unit', 'Units Requested'],
    rows: [{
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'foo',
      'Unit': null,
      'Cost/Unit': undefined,
      'Units Requested': 42
    }]
  };


class TableClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {columns: [], rows: []},
            totalEarning: 0,
            conditions: {
              cardId: "",
              assigned_to: "",
              auction_status: "",
              received_time: "",
            },
        };
    }
    
    setDataValues = () =>
    {
        let myConditions = {...this.state.conditions};
    
        fetch('http://localhost:3001/getAuctionData',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            email: this.props.data.email,
            apikey: this.props.data.apikey,
            conditions: this.state.conditions
            })
        })
        .then(response => response.json())             
        .then(data => {
            console.log("Data is: ", data);
            
            let values = [];
            var totalEarned = 0;
            if(Object.values(data))
            {
              values = data;
              values.map(entry => {
                totalEarned = totalEarned + entry.earned;
              })
            }

            console.log("Total earned is: ", totalEarned);
            console.log("values are: ", values);
                this.setState({
                    data: {
//                        columns: columns,
                        rows: values
                    },
                  totalEarning: totalEarned
                });
        })
        .catch(function (error) {
            console.log(error);
        });    

    }

    componentDidMount() {
        this.setDataValues();
    }

    onChange = (event) => {
        console.log("Triggered: ",event.target);
        let value = event.target.value;
        let tempCondition = {...this.state.conditions};
        if(event.target.id == "assign")
        {
          tempCondition.assigned_to = value;
        }
        if(event.target.id == "status")
        {
          tempCondition.auction_status = value;
        }
        if(event.target.id == "date")
        {
          tempCondition.received_time = value;
        }
        if(event.target.id == "cardid")
        {
          tempCondition.cardId = value;
        }
        this.setState({
          conditions: tempCondition
        }, () => this.setDataValues()
        );
    }

    onClickGoBack = () => {
          this.props.updateRoute("App");
    }


    render() {
        console.log(this.state.data);

        let tempConditions = {
          cardId: "",
          assigned_to: "",
          auction_status: "",
          received_time: "",
        };

        if(this.state.conditions.cardId)
        {
            tempConditions.cardId = this.state.conditions.cardId;
        }
        if(this.state.conditions.assigned_to)
        {
            tempConditions.assigned_to = this.state.conditions.assigned_to;
        }
        if(this.state.conditions.auction_status)
        {
            tempConditions.auction_status = this.state.conditions.auction_status;
        }
        if(this.state.conditions.received_time)
        {
            tempConditions.received_time = this.state.conditions.received_time;
        }

        // Data

        // var dataColumns = tableData.columns;
        // var dataRows = tableData.rows;

        var dataColumns = ["cardId", "tradeId", "player_details", "earned", "assigned_to", "auction_status", "received_time"];

        var dataRows = [];

        // var dat

      if(this.state.data.rows)
      {
//          dataColumns = this.state.data.columns;
          dataRows = this.state.data.rows;
      }
      else
      {
//        dataColumns = ["Card ID", "Trade ID", "Player Details", "Earned", "Assigned To", "Auction Status", "Received Time"];
      }
    //   console.log
      var tableHeaders = (<thead>
            <tr>
              {dataColumns.map(function(column) {
                return <th>{column}</th>; })}
            </tr>
        </thead>);
  
      var tableBody = dataRows.map(function(row) {
        return (
          <tr>
            {dataColumns.map(function(column) {
              return <td>{row[column]}</td>; })}
          </tr>); });
       
      // Decorate with Bootstrap CSS
      return (
        <div style = {{height: "700px", overflow:"scroll", color: "white"}}>

            <div style={{display: "flex", width: "100%"}}>

                    <div style={{width: "20%"}}>
                        <div style={{marginTop: "5%", marginLeft: "5%"}}>
                          <h2 style={{color: "gold"}}>Total Earned is: </h2>
                          <h2 style={{color: "chartreuse"}}>{Math.floor(this.state.totalEarning)}</h2>
                        </div>
                        <div>                          
                          <button 
                          style = {{backgroundColor: "black", color:"red", borderColor: "gold", 
                                width: "auto", height: "auto", padding: "8px", margin: "30px 50px"}}                        
                          onClick={this.onClickGoBack}>Go Back</button>
                        </div>
                    </div>


                    <div style={{display:"flex", width: "80%", marginLeft: "5%"}}>
                      <div style={{ width: "40%", }}>
                      <h4>Card ID: </h4>
                      <input id="cardid" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                      backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                    width: "200px", height: "30px"
                              }}
                          placeholder= "" 
                          value = {`${tempConditions.cardId}`}
                          onChange={this.onChange} ></input>
                      <h4>Assigned To: </h4>
                      <input id="assign" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                      backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                    width: "200px", height: "30px"
                              }}
                          placeholder= "" 
                          value = {`${tempConditions.assigned_to}`}
                          onChange={this.onChange} ></input>

                      </div>                    
                      <div style={{ width: "40%", }}>
                      <h4>Auction Status: </h4>
                      <input id="status" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                      backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                    width: "200px", height: "30px"
                              }}
                          placeholder= "" 
                          value = {`${tempConditions.auction_status}`}
                          onChange={this.onChange} ></input>
                      <h4>Received Time: </h4>
                      <input id="date" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                      backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                    width: "200px", height: "30px"
                              }}
                          placeholder= "" 
                          value = {`${tempConditions.received_time}`}
                          onChange={this.onChange} ></input>
                      </div>
                    </div>
            </div>
              <br />
              <hr style={{borderBottom:"1px dashed black"}}/>
              <br />
            <table className="table table-bordered table-hover" width="100%">
                {tableHeaders}
                {tableBody}
            </table>
        </div>
      ) 
    }
}
          

export default TableClass;
