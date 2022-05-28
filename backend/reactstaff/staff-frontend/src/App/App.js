import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login/Login.js'
import Nav from '../components/Navbar'
import useToken from './useToken';


function App() {
  const { token, setToken } = useToken();

  console.log("token APP:",useToken())
  if(!token) {
    return <Login setToken={setToken} />
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