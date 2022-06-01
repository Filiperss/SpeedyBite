import React, { useState, useEffect} from 'react';
import axios from "axios";

import useToken from "../App/useToken";

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

const baseURL = "http://localhost:8000/webservice";

export default function Dashboard() {
  const [isFree, setIsFree] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({
    name: 'Albino',
    locationTag: '343',
    menuOrdered: [
      { id: 1, ItemName: 'Snow', Type: 'Jon', age: 35 },
      { id: 2, ItemName: 'Lannister', Type: 'Cersei', age: 42 },
      { id: 3, ItemName: 'Lannister', Type: 'Jaime', age: 45 },
      { id: 4, ItemName: 'Stark', Type: 'Arya', age: 16 },
      { id: 5, ItemName: 'Targaryen', Type: 'Daenerys', age: null },
      { id: 6, ItemName: 'Melisandre', Type: null, age: 150 },
      { id: 7, ItemName: 'Clifford', Type: 'Ferrara', age: 44 },
      { id: 8, ItemName: 'Frances', Type: 'Rossini', age: 36 },
      { id: 9, ItemName: 'Roxie', Type: 'Harvey', age: 65 },
    ]
  })
  const [sentOrder, setSentOrder] = useState(false)
  const [robotTime, setRobotTime] = useState(null)

  // function changeFree(){
  //   setIsFree( status => !status)
  // }

  let { token, setToken } = useToken();

  // const sendRobot = () => {
  //   setRobotTime(true)
  //   setSentOrder(true)

  //   console.log('beforeTimer')
  //   const timer = setTimeout(() => {
  //     console.log('This will run after 1 second!')
  //     setRobotTime(false)
  //   }, 5000)

  //   timer()
    
  //   console.log('afterTimer')
  //   clearTimeout(timer);

  // }

  const selectOrder = () => {
		setIsLoading(true)
		const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(config)
		axios.get(baseURL + "/pickOrder",config)
      .then((res) => {
        console.log(res)
        setOrder({
          locationTag: res.data.Input.locationTag,
          name: res.data.Input.clientName,
          menuOrdered: res.data.Input.menuItems,
          TaskToken: res.data.TaskToken,
        });
        setIsFree((status) => !status);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
	}

  const sendRobot = () => {
    setRobotTime(true);
    setSentOrder(true);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const payload = {
      TaskToken: order.TaskToken
    }

    console.log(config);
    axios
      .post(baseURL + "/sendRobot",payload, config)
      .then((res) => {
        setRobotTime(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const columns= [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'ItemName',flex:1, headerName: 'Name', width: 130 },
    { field: 'Type',flex:1, headerName: 'Type', width: 130 }
  ]


  return (
    <div
      style={{
        display: "flex",
        justifyItems: "center",
        flexDirection: "column",
      }}
    >
      {isFree && (
        <div align="center" id="wait-container" style={{ marginTop: "300px" }}>
          <h1 align="center" sx={{ mt: 2 }}>
            {" "}
            Waiting for Orders ...
          </h1>
          <Button variant="contained" color="success" onClick={selectOrder}>
            Start Order
          </Button>
        </div>
      )}

      {!isFree && !sentOrder && (
        <div align="center" id="wait-container">
          <h1 align="center" sx={{ mt: 2 }}>
            {" "}
            You are making an Order{" "}
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              margin: "0 30vw 24px",
            }}
          >
            <p>
              <b>Client: </b> {order.name}
            </p>
            <p>
              <b>Location Tag: </b> {order.locationTag}
            </p>
            <p>
              <b>Order: </b>
            </p>
          </div>
          <DataGrid
            sx={{ height: "600px", mx: "30vw" }}
            rows={order.menuOrdered}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
          />
          <Button
            sx={{ my: "16px" }}
            variant="contained"
            color="success"
            onClick={sendRobot}
          >
            Send Robot
          </Button>
        </div>
      )}

      {sentOrder && (
        <div style={{ marginTop: "300px" }} align="center" id="robot-container">
          {robotTime ? (
            <h1 align="center" sx={{ mt: 2 }}>
              {" "}
              Robot dispatched for Location Tag #343
            </h1>
          ) : (
            <div>
              <h1 align="center" sx={{ mt: 2 }}>
                {" "}
                Robot arrived{" "}
              </h1>
              <Button
                sx={{ my: "16px" }}
                variant="contained"
                color="success"
                onClick={() => {
                  setSentOrder(false);
                  setIsFree(true);
                  setRobotTime(true);
                }}
              >
                Confirm Delivery
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}