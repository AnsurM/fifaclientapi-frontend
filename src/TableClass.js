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
            conditions: {
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
            let columns = Object.keys(data[0]);
            let values = Object.values(data);
            console.log("columns are: ", columns);
            console.log("values are: ", values);
            if(columns.length)
            {
                this.setState({
                    data: {
                        columns: columns,
                        rows: values
                    }
                });   
            }
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
        if(event.target.id == "assign")
        {
            this.setState({
                conditions: {
                    assigned_to: value
            }});
        }
        else if(event.target.id == "status")
        {
            this.setState({
                conditions: {
                    auction_status: value
                }
            });
        }
        else  if(event.target.id == "date")
        {
            this.setState({
                conditions: {
                    received_time: value
                }
            });
        }
        this.setDataValues();
    }

    render() {
        console.log(this.state.data);

        let tempConditions = {
            assigned_to: "",
            auction_status: "",
            received_time: "",
        };

        if(this.state.conditions.assigned_to)
        {
            tempConditions.assigned_to = this.state.conditions.assigned_to;
        }
        else if(this.state.conditions.auction_status)
        {
            tempConditions.auction_status = this.state.conditions.auction_status;
        }
        else if(this.state.conditions.received_time)
        {
            tempConditions.received_time = this.state.conditions.received_time;
        }

        // Data

        // var dataColumns = tableData.columns;
        // var dataRows = tableData.rows;

        var dataColumns = [];
        var dataRows = [];

        // var dat

      if(this.state.data.columns)
      {
          dataColumns = this.state.data.columns;
          dataRows = this.state.data.rows;
              
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
            <div>

                    <h4>Assigned To: </h4>
                    <input id="assign" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                    backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                   width: "100px", height: "25px"
                            }}
                        placeholder= "" 
                        value = {`${tempConditions.assigned_to}`}
                        onChange={this.onChange} ></input>
                    <h4>Auction Status: </h4>
                    <input id="status" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                    backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                   width: "100px", height: "25px"
                            }}
                        placeholder= "" 
                        value = {`${tempConditions.auction_status}`}
                        onChange={this.onChange} ></input>
                    <h4>Received Time: </h4>
                    <input id="date" style={{marginLeft: '10px', borderColor: "gold", borderWidth: "3px",
                                    backgroundColor: "#3A4245", color: "gold", textAlign: "center",
                                   width: "100px", height: "25px"
                            }}
                        placeholder= "" 
                        value = {`${tempConditions.received_time}`}
                        onChange={this.onChange} ></input>
            </div>

            <table className="table table-bordered table-hover" width="100%">
                {tableHeaders}
                {tableBody}
            </table>
        </div>
      ) 
      
    }
    else{
        return (<h1>Loading data...</h1>);
    }

    }
}
          

export default TableClass;
