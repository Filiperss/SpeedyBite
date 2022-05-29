import React from 'react';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { Router, withRouter} from 'react-router-dom';
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

import Pay from './Pay'

const baseURL = "http://localhost:8000/webservice";


class MenuList extends React.Component {

  constructor(props,{ onClick }) {
    super(props);
    this.textreference = React.createRef();    
    this.state = {
      items : [],
      rows: [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 , price: '10€'},
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 , price: '10€'},
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 , price: '10€'},
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 , price: '10€'},
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null , price: '10€'},
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 , price: '10€'},
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 , price: '10€'},
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, price: '10€' },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, price: '10€'},
      ],
      columns: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName',flex:1, headerName: 'First name', width: 130 },
        { field: 'lastName', flex:1, headerName: 'Last name', width: 130 },
        {
          field: 'age',
          headerName: 'Age',
          type: 'number',
          width: 90,
          flex:1
        },
        {
          field: 'fullName',
          flex: 2,
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
          field: 'price',
          flex: 2,
          headerName: 'Price (€)',
          type: 'number',
          sortable: true,
          valueGetter: (params) =>
            `${params.row.price.split('€')[0]}`,
        }
      ],
      clientMenu : [],
      hasErrorLoading: false,
      isLoading: false,
      isPaying: false,
    };   
  }

  componentDidMount(){
    axios.get(baseURL + "/menuList").then((response) => {
        this.setState({isLoading: false})
        this.setState({items : response.data.menuItems });     
    }).catch( err => {
      this.setState({isLoading: false})
      console.log(err.message)
    })  
  }
  
  calculatePrice() {
    let label = '0€'
      if(this.state.clientMenu.length != 0){
        label =  this.state.clientMenu.reduce((accumulator, object) => {
          return accumulator + parseInt(object.price.split('€')[0])
        },0) + '€'
      }
      return <span><b>{label}</b></span>
  }

  payMenu(){
    this.setState({isPaying: true})

    //Router.push('/route/para/o/sitio');
  }

  

  render(){
    const hasPayBeenClicked = this.state.isPaying || false;
    
    const handleLoading = () => this.state.isLoading ? <div>És pilinha</div>:<div>És coninha</div>
    
    return(
      <div>
        <h1 align="center">Menu List</h1>
        {this.state.isLoading ? 
        (
          <div >
            <CircularProgress color="error" size="5rem" sx={{position: 'absolute', left: '47.5%', top: '0', mt: '10rem'}}/>
          </div>  
        ) :
        (
          <div>
            <DataGrid
              sx={{height:'600px', mx: '15vw', mb: '16px', width: 'auto'}}
              rows={this.state.rows}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids)
                const selectedRowData = this.state.rows.filter((row) =>
                  selectedIDs.has(row.id)
                )
                this.setState({clientMenu: selectedRowData})
              }}
              columns={this.state.columns}
              pageSize={10}
              checkboxSelection
            />
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: '16px'}}>
            {this.calculatePrice()}
            <Link to={{ pathname: `/pay?clientMenu=${new Buffer(JSON.stringify(this.state.clientMenu)).toString('base64')}`}}>
              <Button variant="contained" color="success" sx={{mr: '15vw', ml: '16px'}} onClick={() => console.log(this.state.clientMenu)}>Pay</Button>
            </Link>
            </div>
          </div>  
        )}
      </div>  
    )
  }
}

export default MenuList; 
