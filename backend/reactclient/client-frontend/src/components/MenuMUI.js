import React from 'react';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { Buffer } from "buffer";

const baseURL = "http://localhost:8000/webservice";


class MenuList extends React.Component {

  constructor(props,{ onClick }) {
    super(props);
    this.textreference = React.createRef();    
    this.state = {
      items : [],
      columns: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'ItemName',flex:1, headerName: 'Name', width: 130 },
        { field: 'Type', headerName: 'Type', width: 130 },
        {
          field: 'ItemPrice',
          headerName: 'Price (€)',
          sortable: true,
          align: 'right',
          valueGetter: (params) =>
            `${params.row.ItemPrice}€`,
        }
      ],
      clientMenu : [],
      hasErrorLoading: false,
      isLoading: true,
      isPaying: false,
    };   
  }

  componentDidMount(){
    axios.get(baseURL + "/menuList").then((response) => {
        response.data.menuItems.forEach(element => {
          element.id = element.Id
          delete element.Id
        });   
        
        this.setState({isLoading: false})
        this.setState({items : response.data.menuItems });  
        console.log(this.state.items  )
    }).catch( err => {
      this.setState({isLoading: false})
      console.log(err.message)
    })  
  }
  
  calculatePrice() {
    let label = '0€'
      if(this.state.clientMenu.length != 0){
        label =  this.state.clientMenu.reduce((accumulator, object) => {
          return accumulator + parseFloat(object.ItemPrice)
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
          <div>
            <CircularProgress color="error" size="5rem" sx={{position: 'absolute', left: '47.5%', top: '0', mt: '10rem'}}/>
          </div>  
        ) :
        (
          <div>
            <DataGrid
              sx={{height:'600px', mx: '25vw', mb: '16px', width: 'auto'}}
              rows={this.state.items}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids)
                const selectedRowData = this.state.items.filter((row) =>
                  selectedIDs.has(row.id)
                )
                this.setState({clientMenu: selectedRowData})
              }}
              columns={this.state.columns}
              pageSize={10}
              checkboxSelection
            />
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: '16px'}}>
            <b>Total: </b> {this.calculatePrice()}
            {/* <Link style={{textDecoration: 'none'}} to={{ pathname: `/pay?clientMenu=${new Buffer(JSON.stringify(this.state.clientMenu)).toString('base64')}`}}> */}
              <Button 
              href={`/pay?clientMenu=${new Buffer(JSON.stringify(this.state.clientMenu)).toString('base64')}`}
              variant="contained"
              color="success"
              disabled={this.state.clientMenu.length === 0}
              sx={{mr: '25vw', ml: '16px'}}>
                Pay
              </Button>
            {/* </Link> */}
            </div>
          </div>  
        )}
      </div>  
    )
  }
}

export default MenuList; 
