import React from 'react';
import Nav from './components/Navbar'
import Menu from './components/MenuMUI'

import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

import Pay from './components/Pay'

// function RouterFunc() {

//   return element = useRoutes([
//       {path: '/', element: <App />},
//       {path: '/pay', element: <Pay />},
//     ]);
// }


function App() {

  return (
    <div>
      
      <Router>
         <Nav/>
         <div className="wrapper">
          </div>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/pay" element={<Pay />} />
          </Routes>
      </Router>
      
      </div>
  );
 
}

export default App;