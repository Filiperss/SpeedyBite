import './Menu.css';
import React from 'react';
import axios from "axios";

const baseURL = "http://localhost:8000/webservice";

class MenuList extends React.Component {

  constructor(props) {
    super(props);
    this.textreference = React.createRef();    
    this.state = {items : [], clientMenu : [], selectedFile : [], selectedFileName: [] };   
  }

  componentDidMount(){
    // axios.get(baseURL + "/menuList").then((response) => {
    //     this.setState({items : response.data.menuItems });     
    // });     
  }
  
  render(){    
    var reslist = [];
    this.state.items.map((item, index) => {
      reslist.push(<li key={index} > {item.ItemName} - {item.ItemPrice}€
        <button onClick={this.addItemToCart.bind(this, item)}>Add Meal Item</button> 
        </li>);
    });

    var clientItems = [];
    this.state.clientMenu.map((item, index) => {
      clientItems.push(<li key={index} > {item.ItemName} - {item.ItemPrice}€
        <button onClick={this.deleteItemFromCart.bind(this, item)}>Remove Meal Item</button> 
        </li>);
    });

    return(
        <div>    
            <div> 
                <h1>Today's Menu:</h1>           
                <ul>{reslist}</ul>      
                <input type="text" placeholder="Location tag number" ref={this.textreference}/>                         
            </div>

           <div>    
                <h2>Client's Menu List:</h2>        
                <ul>{clientItems}</ul> 
                <span id="clientMenuPrice"></span>
                <button onClick={this.calculatePrice.bind(this, this.state.clientMenu)}>Calculate Payment</button>
            </div> 

            <div>
              <label>Client's Photo</label><br/>
              <input type="file" id="input" accept=".png, .jpg, .jpeg" multiple="false" onChange={(event) => this.fileInputOnChange(event)}></input>
              <br></br>
              <button onClick={this.payMeal.bind(this, this.state.clientMenu)}>Pay</button> 
            </div>   
        </div>
    )
  }

  calculatePrice(items){
    axios.post(baseURL + "/calculateClientMenuPrice", items).then(response => {
      var span = document.getElementById("clientMenuPrice")
      span.innerHTML = response.data;
      span.style = "display: block";
    }).catch(error => {console.log(error)});
  }

  payMeal(mealItems){        
    // Just makes the POST request only if the client selected anything from the menu, uploaded his image and introduced his location tag number
    if(true)//this.state.clientMenu.length > 0 && this.state.selectedFile.length != 0 && this.textreference.current.value != "") 
    {
        axios.post(baseURL + "/pay", {menuItems : mealItems, fileName: this.state.selectedFileName, clientPhoto: this.state.selectedFile}).then(response => {                     
          var span = document.getElementById("clientMenuPrice")
          span.innerHTML = "";
          span.style = "display: none";
        }).catch(error => {console.log(error); });

    }
    else
    {
        alert("Please confirm your data.")
    }
  }

  deleteItemFromCart(index)
  {
    this.setState(function(state, props){
        this.state.clientMenu.splice(index, 1);
    });

    // It forces to render the view with the updated selection from the client 
    this.forceUpdate();
  }

  addItemToCart(item)
  {
    this.setState(function(state, props) {
        state.clientMenu.push(item);
    });

    // It forces to render the view with the updated selection from the client 
    this.forceUpdate();
  }  

  fileInputOnChange(e){
    let reader = new FileReader();

    this.setState({selectedFileName: e.target.files[0].name });

    reader.onload = (e, fileName) => {  
      this.setState({ selectedFile: e.target.result });
    };

    reader.readAsDataURL(e.target.files[0]); 
  }
}

export default MenuList; 
