import React, {useState} from 'react';

import {useLocation} from "react-router-dom";

import { useSearchParams } from "react-router-dom"
import { Buffer } from "buffer";
/*class Pay extends React.Component {

	constructor(props) {
		super(props);
		console.olg(props)
		this.state = {}
	}
	render(){    
		return(
			<div>
				<h1 align="center">Pay</h1>
				{this.props.clientMenu}
			</div>
		)
	}
}*/

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Pay = (props) => {
	// let query = useQuery();
	let [searchParams, setSearchParams] = useSearchParams()
	const cliMenu = Buffer.from(searchParams.get("clientMenu"), 'base64');
	const clientMenu = JSON.parse(cliMenu)
	console.log(clientMenu);

	const calculatePrice = () => {
    let label = '0€'
      if(clientMenu.length != 0){
        label = clientMenu.reduce((accumulator, object) => {
          return accumulator + parseInt(object.price.split('€')[0])
        },0) + '€'
      }
      return <span><b>{label}</b></span>
 	}

	return <div>
				<h1 align="center">Pay</h1>
				{/* {clientMenu} */}
				{calculatePrice()}
			</div>
}

export default Pay; 
