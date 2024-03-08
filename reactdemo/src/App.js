import React from 'react';

import { Routes, Route } from "react-router-dom";
import Login from './components/login';
import SignUp from './components/signup';
import HomePage from './components/HomePage';
import About from './components/about';
import Categories from './components/categories';
import Subcategories from './components/subcategories';
import CategoryList from './components/CategoryList';

import ProductCreation from './components/ProductCreation';
import AddBrand from './components/AddBrand';



import { ToastContainer } from 'react-toastify';
import AddProduct from './components/AddProduct';



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
            <Route path="categorylist" element={<CategoryList />} />
            <Route path="productcreation" element={<ProductCreation />} />
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="add-product" element={<AddProduct />} />

        </Routes>
        <ToastContainer/>
       </div>
)
};
}

export default Home;