import React from 'react';

import { Routes, Route } from "react-router-dom";
import Login from './components/login';
import SignUp from './components/signup';
import HomePage from './components/HomePage';
import About from './components/about';
import Categories from './components/categories';
import Subcategories from './components/subcategories';

class Home extends React.Component {
    
 
  render() {
   
    return (
     
      <div className="app">
        
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<About />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
        </Routes>
       </div>
)
};
}

export default Home;