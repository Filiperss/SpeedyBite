const baseURL = "http://localhost:8000/webservice";

class MenuList extends React.Component {
  
    constructor(props) {
        super(props);
        input.addEventListener("onchange", this.fileInputOnChange());
        this.state = {items : [], clientMenu : [], selectedFile : [] };          
    }

    componentDidMount(){
        axios.get(baseURL + "/menuList").then((response) => {
            this.setState({items : response.data.menuItems });     
        });     
    }

    render(){
        var reslist = [];
        for(var i = 0; i < this.state.items.length; i++){
            reslist.push(<li key={i} > {this.state.items[i].name}
                <button onClick={this.addItemToCart.bind(this, this.state.items[i])} >Add Meal Item</button> 
                </li>)
        }
        
        var clientItems = [];
        for(var i = 0; i < this.state.clientMenu.length; i++){
            clientItems.push(<li key={i} > {this.state.clientMenu[i].name}
                <button onClick={this.deleteItemFromCart.bind(this, this.state.clientMenu[i])}>Remove Meal Item</button> 
                </li>)
        }
        return(
            <div>    
                <div>            
                    <ul>{reslist}</ul>                               
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

    payMeal(mealItems)
    {
        // Just makes the POST request only if the client selected anything from the menu
        if(this.state.clientMenu.length > 0) 
        {    
            axios.post(baseURL + "/pay", { items: mealItems }).then(response => { console.log(response); }).catch(error => {console.log(error); });
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

ReactDOM.render(<MenuList/>, menuList);