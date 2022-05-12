import './App.css';
import React from 'react';
import axios from "axios";

const baseURL = "http://localhost:8000/webservice";

class MenuList extends React.Component {

  constructor(props) {
    super(props);
    this.textreference = React.createRef();    
    this.state = {items : [], clientMenu : [], selectedFile : [] };   
  }

  componentDidMount(){
    axios.get(baseURL + "/menuList").then((response) => {
        this.setState({items : response.data.menuItems });     
    });     
  }
  
  render(){    
    var reslist = [];
    this.state.items.map((item, index) => {
      reslist.push(<li key={index} > {item}
        <button onClick={this.addItemToCart.bind(this, item)}>Add Meal Item</button> 
        </li>);
    });

    var clientItems = [];
    this.state.clientMenu.map((item, index) => {
      clientItems.push(<li key={index} > {item}
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
                <button onClick={this.payMeal.bind(this, this.state.clientMenu)}>Pay</button> 
            </div> 

            <div>
              <label>Client's Photo</label><br/>
              <input type="file" id="input" accept=".png, .jpg, .jpeg" multiple="false" onChange={(event) => this.fileInputOnChange(event)}></input>
            </div>   
        </div>
    )
  }

  payMeal(mealItems)
  {    
    // Just makes the POST request only if the client selected anything from the menu, uploaded his image and introduced his location tag number
    if(this.state.clientMenu.length > 0 && this.state.selectedFile.length != 0 && this.textreference.current.value != "") 
    {
        axios.post(baseURL + "/pay", {menuItems : mealItems, clientPhoto: this.state.selectedFile}).then(response => { console.log(response); }).catch(error => {console.log(error); });
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

    reader.onload = (e) => {      
      this.setState({ selectedFile: e.target.result});
    };

    reader.readAsDataURL(e.target.files[0]); 
  }
}

export default MenuList; 
