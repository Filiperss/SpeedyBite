import React, {useRef, useEffect, useState} from 'react';
import { useSearchParams } from "react-router-dom"
import { Buffer } from "buffer";
import axios from "axios";

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import './Pay.css';

const baseURL = "http://localhost:8000/webservice";

const Pay = (props) => {

	let [searchParams, setSearchParams] = useSearchParams()
	const cliMenu = Buffer.from(searchParams.get("clientMenu"), 'base64');
	const clientMenu = JSON.parse(cliMenu)

	const [locationTag, setLocationTag] = useState(null);
	const handleLocationTag = (event) => {
		var regex = /^(?:[0-9]{5}|[0-9]{10}|)$./;
		if(event.target.value <= 999 && event.target.value >= 0 && !regex.test(event.target.value)){
			setLocationTag(event.target.value);
		}
	};


	// Camera Settings
	const videoRef = useRef(null)
	const photoRef = useRef(null)
	const [hasPhoto,setHasPhoto] = useState(false)
	const [checkDisabled,setCheckDisabled] = useState(true)

	const getVideo = () => {
		navigator.mediaDevices.getUserMedia({video : {width: 450, height: 300}}).then(stream => {
			let video = videoRef.current
			video.srcObject = stream
			video.play()
			setCheckDisabled(false)
		})
		.catch(err => console.log(err))
	}

	const takePhoto = () => {
		const width = 450;
		const height = 300;
	
		let video = videoRef.current
		let photo = photoRef.current

		photo.width = width
		photo.height = height

		let ctx = photo.getContext('2d')
		ctx.drawImage(video,0,0,width,height)
		setHasPhoto(true)

		console.log(photoRef.current.toDataURL("image/png"))
	}

	useEffect(() => {
		getVideo()

	}, [videoRef])
	
	const calculatePrice = () => {
		let label = '0€'
		if(clientMenu.length !== 0){
			label = clientMenu.reduce((accumulator, object) => {
          return accumulator + parseFloat(object.ItemPrice)
        },0) + '€'
      }
      return <span><b>{label}</b></span>
	}
	
	const hasMakeOrder = () =>{
		return !((locationTag && hasPhoto) && !isPaying)
	}

	const [isPaying,setIsPaying] = useState(false)
	const [payMessage,setPayMessage] = useState(null)
	const [errorOccured,setErrorOccured] = useState(null)

	const payOrder = () => {
		setIsPaying(true)
		const payload = {
			menuItems : JSON.stringify(clientMenu),
			locationTag: locationTag,
			clientPhoto: photoRef.current.toDataURL("image/png")
		}

		axios.post(baseURL + "/pay", payload).then(res => {                     
          setIsPaying(false)
		  setPayMessage(res.data.message)
		  setErrorOccured(null)
		  console.log(payMessage)
        }).catch(error => {
			setIsPaying(false)
			console.log(error);
			setPayMessage(null)
			setErrorOccured(error.response? error.response.data.message : error.message)
		 });

	}


	return <div className="container">
				<h1 align="center">Payment Area</h1>
			
	 			{!payMessage && (
				 <div>
					<div className={"camera " + (hasPhoto? 'hide-camera': '')}>
						<video ref={videoRef}></video>
						<Button 
						variant="contained"
						color="success"
						className="snap-btn"
						size="small"
						disabled={checkDisabled}
						onClick={takePhoto}>Take a photo</Button>
					</div>

					<div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
						<canvas ref={photoRef}></canvas>
						<Button 
						variant="contained"
						color="error"
						className="retake"
						size="small"
						onClick={() =>{
							setHasPhoto(false)
							setCheckDisabled(false)
						}}
						>Retake</Button>
					</div>

					<div>
						<TextField
						required
						type="number"
						min={0}
						max={999}
						id="outlined-required"
						label="Location Tag Number"
						placeholder="001"
						size="small"
						color="error"
						value={locationTag}
						onChange={handleLocationTag}
						/>
						<LoadingButton 
						variant="contained"
						color="success"
						size="large"
						sx={{ml: '24px'}}
						disabled={hasMakeOrder()}
						onClick={payOrder}
						loading={isPaying}
						>Make Order ({calculatePrice()})</LoadingButton>
					</div>
				</div>
				)}

				{payMessage && (
				<div className="success-container">
					<h1>{payMessage}</h1>
					<Button 
						variant="contained"
						color="success"
						size="large"
						href="/"
						>Make a new Order</Button>
				</div>
				)}

				{errorOccured && (
					<Alert sx={{mt: '48px'}} variant="filled" severity="error">
						{errorOccured}
					</Alert>
				)}
			</div>
}

export default Pay; 
