import React from 'react';
import Nav from './components/Navbar'
import Menu from './components/Menu'

function App() {
  return (
    <div>
      <Nav/>
      <div className="wrapper">
        <Menu/>
      </div>
    </div>
  );
 
}

export default App;