import React from "react";

import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/signup";
import HomePage from "./components/HomePage";
import About from "./components/about";
// import Categories from "./components/categories";
// import Subcategories from "./components/subcategories";
import CategoryList from "./components/CategoryList";

import ProductCreation from "./components/ProductCreation";
import AddBrand from "./components/AddBrand";

import { ToastContainer } from "react-toastify";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import PunctureRepair from "./components/PunctureRepair";
import PunctureRepairList from "./components/PunctureRepairList";
import Feedback from "./components/Feedback";
import MyAccount from "./components/MyAccount";
import CartPage from "./components/CartPage";
import Header from "./components/Header";
import WelcomeMessage from "./components/WelcomeMessage";
import MainPopup from "./components/MainPopup";
import PaymentInfo from "./components/PaymentInfo";
import OrderList from "./components/OrderList";

import SearchResult from "./components/Search/SearchResult";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      showWelcomeBanner: true,
    };
  }
  handleCloseWelcomeMessage = () => {
    this.setState({ showWelcomeMessage: false });
  };
  componentDidMount() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    this.setState({ isAdmin });
  }

  render() {
    const { showWelcomeMessage } = this.state;
    const { history } = this.props;

    return (
      <div className="app">
        {showWelcomeMessage && (
          <WelcomeMessage onClose={this.handleCloseWelcomeMessage} />
        )}
        <div className="navigation">
          <Header />
        </div>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<About />} />
            {/* <Route path="categories" element={<Categories />} /> */}
            {/* <Route path="subcategories" element={<Subcategories />} /> */}
            <Route path="categorylist" element={<CategoryList />} />
            <Route path="productcreation" element={<ProductCreation />} />
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="puncture-repair" element={<PunctureRepair />} />
            <Route path="header" element={<Header />} />
            {this.state.isAdmin ? (
              <Route
                path="puncture-repair-list"
                element={<PunctureRepairList />}
              />
            ) : null}

            <Route path="feedback-list" element={<Feedback />} />
            <Route path="myAccount" element={<MyAccount />} />
            <Route path="cart-page" element={<CartPage />} />

            <Route path="*" element={<Login />} />
            <Route path="MainPopup" element={<MainPopup />} />
            {/* <Route path="payment-info" element={<PaymentInfo />} /> */}
            <Route
              path="payment-info"
              element={<PaymentInfo history={history} />}
            />

            <Route path="/search-results" element={<SearchResult />} />
            <Route path="/order-list" element={<OrderList />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default Home;
