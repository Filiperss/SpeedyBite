//import axios from 'axios';
const baseURL = "localhost:8000/webservice";

class MenuList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items : ["sopa 1", "sopa 2", "carne 1", "peixe 2"], clientMenu : []};
    }

    render(){
        var reslist = [];
        for(var i = 0; i < this.state.items.length; i++){
            reslist.push(<li key={i} > {this.state.items[i]}
                <button onClick={this.addItemToCart.bind(this, this.state.items[i])}>Add Meal Item</button> 
                </li>)
        }

        var clientItems = [];
        for(var i = 0; i < this.state.clientMenu.length; i++){
            clientItems.push(<li key={i} > {this.state.clientMenu[i]}
                <button onClick={this.deleteItemFromCart.bind(this, this.state.clientMenu[i])}>Remove Meal Item</button> 
                </li>)
        }
        return(
            <div>    
                <div>            
                <ul>
                    {reslist}              
                </ul> 
                <button onClick={this.payMeal.bind(this, this.state.clientMenu)}>Pay</button> 
                </div>

                <div>    
                    <h2>Client's Menu List:</h2>        
                    <ul>
                        {clientItems}      
                    </ul> 
                </div>
            </div>
        )
    }

    payMeal(mealItems)
    {
        axios.post(baseURL + "/pay", mealItems).then(response => { console.log(response); }).catch(error => {console.error(error); });
    }
    
    deleteItemFromCart(index)
    {
        this.setState(function(state, props){
            this.state.clientMenu.splice(index, 1);
        });
        this.forceUpdate();
    }

    addItemToCart(item)
    {
        this.setState(function(state, props) {
            state.clientMenu.push(item);
        });
        this.forceUpdate();
    }
}

ReactDOM.render(<MenuList/>, menuList);