import React from 'react';
// import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login/Login.js'
import Nav from '../components/Navbar'
import useToken from './useToken';
import requestToken from './requestToken';

import { isExpired, useJwt } from "react-jwt";
// import { render } from '@testing-library/react';

function App() {
  let { token, setToken } = useToken();

  const { decodedToken, isExpired } = useJwt(token);
  
  console.log("token", token)

  if(!token) {
    return  <Login setToken={setToken} />
  }
  
  if(isExpired){
    token = requestToken(token,setToken)
    if(token === undefined) {
      return <Login setToken={setToken} />
    }
  }

  return (
    <div><Nav/>
      <div className="wrapper">
        
        {/* /* <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>
        </BrowserRouter> */}
        <Dashboard/>
      </div>
    </div>
  );
 
}

export default App;