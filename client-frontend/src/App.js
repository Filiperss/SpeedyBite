import './App.css';
import React from 'react';
import axios from "axios";

const baseURL = "http://localhost:8000/webservice";

class MenuList extends React.Component {

  constructor(props) {
    super(props);
    var input = document.getElementById("input");
    input.addEventListener("onchange", this.fileInputOnChange());
    this.textreference = React.createRef();
    this.state = {items : ["lomboa", "asda"], clientMenu : [], selectedFile : [] };   
  }

  componentDidMount(){
    axios.get(baseURL + "/menuList").then((response) => {
        //this.setState({items : response.data.menuItems });     
    });     
  }

  render(){
    var reslist = [];
    console.log(this.state.items);
    for(var i = 0; i < this.state.items.length; i++){
        reslist.push(<li key={i}>{this.state.items[1].name}
            <button onClick={this.addItemToCart.bind(this, this.state.items[i])}>Add Meal Item</button> 
            </li>)
    }
    
    var clientItems = [];
    for(var i = 0; i < this.state.clientMenu.length; i++){
        clientItems.push(<li key={i}> {this.state.clientMenu[i].name}
            <button onClick={this.deleteItemFromCart.bind(this, this.state.clientMenu[i])}>Remove Meal Item</button> 
            </li>)
    }
    return(
        <div>    
            <div> 
                <h1>Today's Menu:</h1>           
                <ul>{reslist}</ul>      
                <input type="text" placeholder="Location tag number" ref={this.textreference}/>                         
            </div>

           <div>    
                <h2>Client's Menu List:</h2>        
                <ul>
                    {clientItems}      
                </ul> 
                <button onClick={this.payMeal.bind(this, this.state.clientMenu)}>Pay</button> 
            </div> 
        </div>
    )
  }

  convertFileToJson(){
    
    // reCreate new Object and set File Data into it
    var newObject  = {
    'lastModified'     : this.state.selectedFile.lastModified,
    'lastModifiedDate' : this.state.selectedFile.lastModifiedDate,
    'name'             : this.state.selectedFile.name,
    'size'             : this.state.selectedFile.size,
    'type'             : this.state.selectedFile.type
    };  
    
    // then use JSON.stringify on new object
    return JSON.stringify(newObject);
  }

  payMeal(mealItems)
  {
    // Just makes the POST request only if the client selected anything from the menu, uploaded his image and introduced his location tag number
    
    if(this.state.clientMenu.length > 0 && this.state.selectedFile != undefined && this.textreference.current.value != "") 
    {    
        var image = this.convertFileToJson();
        axios.post(baseURL + "/pay", {menuItems : mealItems, clientPhoto: image}).then(response => { console.log(response); }).catch(error => {console.log(error); });
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

  fileInputOnChange(){
    const fileInput = document.getElementById('input');
    fileInput.onchange = () => {
        this.setState(function(state, props){
            this.state.selectedFile = fileInput.files[0];
        });
    }
  }
}

export default MenuList; 
