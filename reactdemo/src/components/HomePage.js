import React, { Component, useState } from "react";
import { FaBicycle, FaCar } from "react-icons/fa";
import axios from "axios";
import "../css/home.css";
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      products: [],
      carBrands: [],
      bikeBrands: [],
      cart: [],
      selectedProduct: null,
      searchData: [], // Your original data array
      searchQuery: "",
      searchResults: [],
      isFormVisible: false,
      feedback: "",
    };
    this.fetchAllProducts();
    this.fetchAllBikeProducts();
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.fetchCartFromLocalStorage();
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "feedback/addFeedback",
        { feedback: this.state.feedback }
      );
      console.log("Feedback submitted:", response.data);
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  handleChange = (e) => {
    this.setState({ feedback: e.target.value });
  };

  calculateDiscountPercentage = async (mrp, price) => {
    return ((mrp - price) / mrp) * 100;
  };

  fetchAllBikeProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );
      console.log("fetchAllProducts Response:", response.data);
      console.log("áddfdfsfsdf : ", response.data);

      let bikeBrands = [];
      response.data
        .filter((prod) => prod.categoryName === "Two Wheeler")
        .forEach(async (prod, index) => {
          console.log(prod.vehicleBrandModels);
          if (prod.vehicleBrandModels) {
            prod.vehicleBrandModels.forEach((vehi, index2) => {
              console.log(vehi.name);
              if (!bikeBrands.includes(vehi.name) && bikeBrands.length < 10) {
                bikeBrands.push(vehi.name);
              }
            });
            const discountPercentage = await this.calculateDiscountPercentage(
              prod.productMrpPrice,
              prod.productPrice
            );
            console.log("discounttt", discountPercentage);
            prod.discount = Math.floor(discountPercentage) + " % off";
          }
        });
      response.data
        .filter(
          (prod) => prod.categoryName === "Four Wheeler" || "Three Wheeler"
        )
        .forEach(async (prod, index) => {
          const discountPercentage = await this.calculateDiscountPercentage(
            prod.productMrpPrice,
            prod.productPrice
          );
          console.log("discounttt", discountPercentage);
          prod.discount = Math.floor(discountPercentage) + " % off";
        });
      this.setState({ products: response.data, bikeBrands: bikeBrands });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );

      let carBrands = [];
      response.data
        .filter((prod) => prod.categoryName === "Four Wheeler")
        .forEach(async (prod, index) => {
          console.log(prod.vehicleBrandModels);
          if (prod.vehicleBrandModels) {
            prod.vehicleBrandModels.forEach((vehi, index2) => {
              console.log(vehi.name);
              if (!carBrands.includes(vehi.name) && carBrands.length < 10) {
                carBrands.push(vehi.name);
              }
            });
          }
        });
      console.log("fetchAllProducts CARRRRR:", response.data);
      this.setState({ products: response.data, carBrands: carBrands });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  logout() {
    localStorage.clear();
    window.location = "http://localhost:3000/tyrecentre/#/login";
    // window.location = "https://ashwinm-oo7.github.io/tyrecentre/#/login";
  }
  handleAddToCart = (product) => {
    const updatedCart = [...this.state.cart, product];
    this.setState({ cart: updatedCart }, () => {
      this.saveCartToLocalStorage(updatedCart);
    });
  };

  handleRemoveFromCart(index) {
    // Remove the item at the specified index from the cart
    const updatedCart = [...this.state.cart];
    updatedCart.splice(index, 1);
    this.setState({ cart: updatedCart }, () => {
      this.saveCartToLocalStorage(updatedCart);
    });
  }

  calculateTotal() {
    let total = 0;
    this.state.cart.forEach((item) => {
      const price = parseFloat(item.productPrice); // Conshvert to number
      if (!isNaN(price)) {
        total += price;
      }
    });
    const shippingCost = 20; // Assuming shipping cost is $20
    total += shippingCost;
    return total;
  }

  handleCheckout() {
    // Calculate tax (28%)
    const taxRate = 0.28;
    const subtotal = this.calculateTotal();
    const taxAmount = subtotal * taxRate;
    const finalAmount = subtotal + taxAmount;

    // Display the checkout information
    console.log("Subtotal:", subtotal);
    console.log("Tax (28%):", taxAmount);
    console.log("Final Amount to Pay:", finalAmount);

    // You can perform additional actions here, such as sending the checkout information to the server or navigating to a checkout page
  }

  fetchCartFromLocalStorage() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      this.setState({ cart: JSON.parse(cart) });
    }
  }

  saveCartToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  fetchProductDetails = (selectedProduct) => {
    console.log("Selected Product:", selectedProduct); // For debugging
    // Perform any additional actions to fetch product details as needed
    this.setState({ selectedProduct });
  };

  handleInputChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query }, () => {
      this.performSearch();
    });
  };

  performSearch = () => {
    const { searchData, searchQuery } = this.state;
    const results = searchData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ searchResults: results });
  };
  toggleFormVisibility = () => {
    this.setState({ isFormVisible: !this.state.isFormVisible });
  };

  render() {
    const { searchQuery, searchResults } = this.state;
    const { isFormVisible } = this.state;

    return (
      <div className="">
        <header class="header-area header-padding-1 sticky-bar header-res-padding clearfix">
          <div class="container-fluid">
            <div class="row">
              <div class="col-xl-2 col-lg-2 col-md-6 col-4">
                <div class="logo">
                  <a href="/">
                    <img
                      alt=""
                      src="assets/img/logo/tyrelogo.jpg"
                      style={{ width: "120px", height: "auto" }}
                    />
                  </a>
                </div>
              </div>
              <div class="col-xl-8 col-lg-8 d-none d-lg-block">
                <div class="main-menu" style={{ backgroundColor: "#e6e6ff" }}>
                  <nav>
                    <ul>
                      <li>
                        <a href="/">
                          <FaCar /> Cars <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="mega-menu mega-menu-padding">
                          <li>
                            <ul>
                              <li class="mega-menu-title">
                                <a>Four Wheeler</a>
                              </li>
                              {this.state.carBrands.map((vehi, index2) => (
                                <li>
                                  <a href="#" key={index2}>
                                    {vehi}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li class="mega-menu-img">
                                <a href="#">
                                  <img
                                    src="assets/img/cars/car.webp"
                                    style={{ width: "400px" }}
                                    alt=""
                                  />
                                  <img
                                    src="assets/img/cars/4tyre.webp"
                                    style={{ width: "450px" }}
                                    alt=""
                                  />
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <a href="#">
                          <FaBicycle /> Bike <i class="fa fa-angle-down"></i>{" "}
                        </a>
                        <ul class="mega-menu">
                          <li>
                            <ul>
                              <li class="mega-menu-title">
                                <a href="#">Two Wheeler</a>
                              </li>
                              {this.state.bikeBrands.map((vehi, index2) => (
                                <li>
                                  <a href="#" key={index2}>
                                    {vehi}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li class="mega-menu-img">
                                <a href="#">
                                  <img
                                    src="assets/img/cars/scooter.webp"
                                    style={{ width: "350px" }}
                                    alt=""
                                  />
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#">
                          Details <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <p>
                              <a href="/tyrecentre/#/login">login / register</a>
                            </p>
                          </li>
                          <li>
                            <a href="/tyrecentre/#/about">about us</a>
                          </li>
                          <li>
                            <a href="#">cart page</a>
                          </li>
                          <li>
                            <a href="#">checkout </a>
                          </li>
                          <li>
                            <a href="#">wishlist </a>
                          </li>
                          <li>
                            <a href="/tyrecentre/#/myAccount">My Account</a>
                          </li>
                          <li>
                            <a href="#">contact us </a>
                          </li>
                          <li>
                            <a href="#">404 page </a>
                          </li>
                        </ul>
                      </li>
                      {/* <li>
                        <a href="#">
                          Blog <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <a href="#">blog standard</a>
                          </li>
                          <li>
                            <a href="#">blog no sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog right sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog details 1</a>
                          </li>
                          <li>
                            <a href="#">blog details 2</a>
                          </li>
                          <li>
                            <a href="#">blog details 3</a>
                          </li>
                        </ul>
                      </li> */}
                      {/* <li>
                        <a href="/tyrecentre/#/about"> About </a>
                      </li> */}
                      {/* <li>
                        <a href="/tyrecentre/#/categories">
                          Categories <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <a href="/tyrecentre/#/CategoryList">
                              CategoryList
                            </a>
                          </li>
                          <li>
                            <a href="#">blog no sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog right sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog details 1</a>
                          </li>
                          <li>
                            <a href="#">blog details 2</a>
                          </li>
                          <li>
                            <a href="#">blog details 3</a>
                          </li>
                        </ul>
                      </li> */}
                      {localStorage.getItem("isAdmin") === "true" ? (
                        <li>
                          <a href="#">
                            {" "}
                            Masters <i class="fa fa-angle-down"></i>
                          </a>
                          <ul class="submenu">
                            <li>
                              <a href="/tyrecentre/#/add-brand">Add Brand</a>
                            </li>
                            <li>
                              <a href="/tyrecentre/#/CategoryList">
                                CategoryList
                              </a>
                            </li>
                            <li>
                              <a href="/tyrecentre/#/puncture-repair-list?isAdmin=true&isAdmin=true">
                                Puncture Repair List
                              </a>
                            </li>
                            <li>
                              <a href="/tyrecentre/#/product-list">
                                Product List
                              </a>
                            </li>
                            <li>
                              <a href="/tyrecentre/#/feedback-list">
                                Feedback List
                              </a>
                            </li>
                          </ul>
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-6 col-8">
                <div class="header-right-wrap">
                  <div class="same-style header-search">
                    <a class="search-active" href="#">
                      <i class="pe-7s-search"></i>
                    </a>
                    <div class="search-content">
                      <form action="#">
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={this.handleInputChange}
                        />
                        <ul>
                          {searchResults.map((result) => (
                            <li key={result.id}>{result.name}</li>
                          ))}
                          <i class="pe-7s-search"></i>
                        </ul>
                        {/* </button> */}
                      </form>
                    </div>
                  </div>
                  {localStorage.getItem("userEmail") ? (
                    <div class="same-style account-satting">
                      <a class="account-satting-active" href="#">
                        <i class="pe-7s-user-female"></i>
                      </a>
                      <div class="account-dropdown">
                        <ul>
                          <li>
                            <a
                              onClick={() => this.logout()}
                              href="/tyrecentre/#/login"
                            >
                              {localStorage.getItem("userEmail")
                                ? "Logout"
                                : "Login"}{" "}
                            </a>
                          </li>

                          <li>
                            <a href="/tyrecentre/#/sign-up">Register</a>
                          </li>
                          <li>
                            <a href="#">Wishlist </a>
                          </li>
                          <li>
                            <a href="#">my account</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div class="same-style account-satting">
                      <a class="account-satting-active" href="#">
                        <i class="pe-7s-user-female"></i>
                      </a>
                      <div class="account-dropdown">
                        <ul>
                          <li>
                            <a
                              onClick={() => this.logout()}
                              href="/tyrecentre/#/login"
                            >
                              {localStorage.getItem("userEmail")
                                ? "Logout"
                                : "Login"}{" "}
                            </a>
                          </li>

                          <li>
                            <a href="/tyrecentre/#/sign-up">Register</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {this.state.selectedProduct && (
                    <div class="same-style header-wishlist">
                      <a href="#">
                        <i class="pe-7s-like"></i>
                        {/* <p>{this.state.selectedProduct.productName}</p> */}
                      </a>
                    </div>
                  )}
                  {/* 888888888888 CART LIST 888888888888888888888888888 */}
                  <div class="same-style cart-wrap">
                    <button class="icon-cart" onClick={this.handleCartClick}>
                      <i class="pe-7s-shopbag"></i>
                      <span class="count-style">{this.state.cart.length}</span>
                    </button>
                    <div
                      className="shopping-cart-content"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <ul>
                        {this.state.cart.map((item, index) => (
                          <li class="single-shopping-cart" key={index}>
                            <div class="shopping-cart-img">
                              <a href="#">
                                <img
                                  alt=""
                                  src={item.productImages[0].dataURL}
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </a>
                            </div>
                            <div class="shopping-cart-title">
                              <h4>
                                <a href="#">
                                  {item.tyreSize}
                                  <span style={{ marginRight: "5px" }}></span>
                                  {item.productName}
                                </a>
                              </h4>
                              <h6>Qty: {item.productQuantity}</h6>
                              <span>&#8377;{item.productPrice}</span>
                            </div>
                            <div class="shopping-cart-delete">
                              {/* <a href="#">
                              <i class="fa fa-times-circle"></i>
                            </a> */}
                              <button
                                onClick={() => this.handleRemoveFromCart(index)}
                              >
                                <i className="fa fa-times-circle"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {/* *******CART TOTAL *********** */}
                      <div class="shopping-cart-total">
                        <h4>
                          Shipping : <span>&#8377;20.00</span>
                        </h4>
                        <h4>
                          SubTotal:
                          <span className="shop-total">
                            &#8377;{this.calculateTotal()}
                          </span>
                        </h4>
                        <h4>
                          Tax (28%):
                          <span className="shop-total">
                            &#8377;{(this.calculateTotal() * 0.28).toFixed(2)}
                          </span>
                        </h4>
                        <h4>
                          Final Amount to Pay:
                          <span>
                            &#8377;{(this.calculateTotal() * 1.28).toFixed(2)}
                          </span>
                        </h4>
                      </div>
                      <div class="shopping-cart-btn btn-hover text-center">
                        <a class="default-btn" href="#">
                          view cart
                        </a>
                        <button
                          className="default-btn"
                          onClick={this.handleCheckout}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 77777777777777777777 */}
            </div>
            <div class="mobile-menu-area">
              <div class="mobile-menu">
                <nav id="mobile-menu-active">
                  <ul class="menu-overflow">
                    <li>
                      <a href="/tyrecentre/#/home">HOME</a>
                      <ul>
                        <li>
                          <a href="#">Collection</a>
                          <ul>
                            <li>
                              <a href="#">Two Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Three Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Four Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Puncture Material Kit</a>
                            </li>
                            <li>
                              <a href="#">Tubes</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Shop</a>
                      <ul>
                        <li>
                          <a href="#">Tyre Company</a>
                          <ul>
                            <li>
                              <a href="https://www.mrftyres.com/">MRF</a>
                            </li>
                            <li>
                              <a href="https://www.ceat.com/">CEAT</a>
                            </li>
                            <li>
                              <a href="https://www.bridgestone.co.in/">
                                Bridge Stone
                              </a>
                            </li>
                            <li>
                              <a href="https://jktyre.com/">JK Tyre</a>
                            </li>
                            <li>
                              <a href="https://tvseurogrip.com/">TVS</a>
                            </li>
                            <li>
                              <a href="https://www.goodyear.co.in/">GoodYear</a>
                            </li>
                            <li>
                              <a href="https://www.michelin.in/">Michelin</a>
                            </li>
                          </ul>
                        </li>
                        {/* <li>
                          <a href="#">product details</a>
                          <ul>
                            <li>
                              <a href="#">tab style 1</a>
                            </li>
                            <li>
                              <a href="#">tab style 2</a>
                            </li>
                            <li>
                              <a href="#">tab style 3</a>
                            </li>
                            <li>
                              <a href="#">sticky style</a>
                            </li>
                            <li>
                              <a href="#">gallery style </a>
                            </li>
                            <li>
                              <a href="#">Slider style</a>
                            </li>
                            <li>
                              <a href="#">affiliate style</a>
                            </li>
                            <li>
                              <a href="#">fixed image style </a>
                            </li>
                          </ul>
                        </li> */}
                      </ul>
                    </li>
                    {localStorage.getItem("isAdmin") === "true" ? (
                      <li>
                        <a>Master Admin</a>
                        <ul>
                          <li>
                            <a href="/tyrecentre/#/add-brand">Add Brand</a>
                          </li>
                          <li>
                            <a href="/tyrecentre/#/puncture-repair-list?isAdmin=true&isAdmin=true">
                              Puncture Repair List
                            </a>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )}
                    <li>
                      <a>Pages</a>
                      <ul>
                        <li>
                          <a href="/tyrecentre/#/about">about us</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div class="slider-area">
          <div class="slider-active owl-carousel nav-style-1 owl-dot-none">
            <div class="single-slider slider-height-1 bg-purple">
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-content slider-animated-1">
                      <h3 class="animated"> Tubeless Tyre</h3>
                      <h1 class="animated">
                        Choose Best Tyre Offer <br />
                        2024 Collection
                      </h1>
                      <div class="slider-btn btn-hover">
                        <a class="animated" href="#">
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-single-img slider-animated-1">
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat.webp"
                        alt=""
                      />
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat2.webp"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="single-slider slider-height-1 bg-purple">
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-content slider-animated-1">
                      <h3 class="animated"> All Type of Variants</h3>
                      <h1 class="animated">
                        Best Services <br />
                        ALL TIME
                      </h1>
                      <div class="slider-btn btn-hover">
                        <a class="animated" href="#">
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-single-img slider-animated-1">
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat4.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="suppoer-area pt-100 pb-60">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-1">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-1.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Free Shipping</h5>
                    <p>Free shipping on all order</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <a href="/tyrecentre/#/puncture-repair">
                  <div class="support-wrap mb-30 support-2">
                    <div class="support-icon">
                      <img
                        class="animated"
                        src="assets/img/icon-img/tyre-repair.jpg"
                        alt=""
                      />
                    </div>
                    <div class="support-content">
                      <h5>Tyre Puncture Service</h5>
                      <p>Tyre Puncture Service For All Tyre</p>
                    </div>
                  </div>
                </a>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-3">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-3.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Money Return</h5>
                    <p>T&C apply</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-4">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-4.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Order Discount</h5>
                    <p>Best Offer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="product-area pb-60">
          <div class="container">
            <div class="section-title text-center">
              <h2>DAILY DEALS!</h2>
            </div>
            <div class="product-tab-list nav pt-30 pb-55 text-center">
              <a href="#product-1" data-bs-toggle="tab">
                <h4>Two Wheeler </h4>
              </a>
              <a class="active" href="#product-2" data-bs-toggle="tab">
                <h4>Four Wheeler </h4>
              </a>
              <a href="#product-3" data-bs-toggle="tab">
                <h4>Three Wheeler</h4>
              </a>
            </div>
            <div class="tab-content jump">
              <div class="tab-pane" id="product-1">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Two Wheeler")
                    .map((prod, index) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div class="product-img">
                            <a href="##" key={index}>
                              <img
                                className="default-img"
                                src={prod.productImages[1].dataURL}
                                alt={`Imagee ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Imagee ${index}`}
                              />
                            </a>
                            <span class="pink">{prod.discount}</span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div class="pro-same-action pro-wishlist">
                                <a title="Wishlist" href="/">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              {/* 000 */}
                              <div class="pro-same-action pro-cart">
                                <a
                                  onClick={() => this.handleAddToCart(prod)}
                                  title="Add To Cart"
                                >
                                  <i class="pe-7s-cart"></i> Add to cart
                                </a>
                              </div>

                              {/* 000 */}
                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="/"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div class="product-content text-center">
                            <h5>{prod.subCategoryName}</h5>
                            <h3>
                              <a href="/">{prod.productName}</a>
                            </h3>
                            <h3>
                              <span>{prod.tyreSize}</span>
                            </h3>
                            <div class="product-rating">
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div class="tab-pane active" id="product-2">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Four Wheeler")
                    .map((prod, index) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div class="product-img">
                            <a href="##" key={index}>
                              <img
                                className="default-img"
                                src={prod.productImages[1].dataURL}
                                alt={`Imagee ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Imagee ${index}`}
                              />
                            </a>
                            <span class="pink">{prod.discount}</span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div
                                class="pro-same-action pro-wishlist"
                                onClick={() => {
                                  this.setState({ selectedProduct: prod });
                                }}
                              >
                                <a title="Wishlist" href="##">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              <div class="pro-same-action pro-cart">
                                <a
                                  onClick={() => this.handleAddToCart(prod)}
                                  title="Add To Cart"
                                >
                                  <i class="pe-7s-cart"></i> Add to cart
                                </a>
                              </div>
                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div class="product-content text-center">
                            <h5>{prod.subCategoryName}</h5>
                            <h3>
                              <a href="#">{prod.productName}</a>
                            </h3>
                            <h3>
                              <span>{prod.tyreSize}</span>
                            </h3>
                            <div class="product-rating">
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div class="tab-pane" id="product-3">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Three Wheeler")
                    .map((prod, index) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div class="product-img">
                            {/* <a href="#">
                                                <img class="default-img" src="assets/img/product/Ceat6.webp" alt=""/>
                                                <img class="hover-img" src="assets/img/product/Ceat7.webp" alt=""/>
                                            </a> */}

                            <a href="#" key={index}>
                              <img
                                className="default-img"
                                src={prod.productImages[1].dataURL}
                                alt={`Image ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Image ${index}`}
                              />
                            </a>
                            <span class="pink">{prod.discount}</span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div class="pro-same-action pro-wishlist">
                                <a title="Wishlist" href="##">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              {/* 0000 */}

                              <div class="pro-same-action pro-cart">
                                <a
                                  onClick={() => this.handleAddToCart(prod)}
                                  title="Add To Cart"
                                  href="#"
                                >
                                  <i class="pe-7s-cart"></i> Add to cart
                                </a>
                              </div>

                              {/* 000 */}
                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div class="product-content text-center">
                            <h5>{prod.subCategoryName}</h5>
                            <h3>
                              <a href="#">{prod.productName}</a>
                            </h3>
                            <h3>
                              <span>{prod.tyreSize}</span>
                            </h3>
                            <div class="product-rating">
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="blog-area pb-55">
          <div class="container">
            <div class="section-title text-center mb-55">
              <h2>OUR BLOG</h2>
            </div>
            <div class="row"></div>
          </div>
        </div>
        <footer class="footer-area bg-gray pt-100 pb-70">
          <div class="container">
            <div class="row">
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="copyright mb-30">
                  <div class="footer-logo">
                    <a href="#">
                      <img
                        alt=""
                        src="assets/img/logo/tyrelogo.jpg"
                        style={{ width: "120px", height: "auto" }}
                      />
                    </a>
                  </div>
                  <p>
                    © 2024 <a href="#">Tyrewala</a>.<br /> All Rights Reserved
                  </p>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="footer-widget mb-30 ml-30">
                  <div class="footer-title">
                    <h3>ABOUT US</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a href="/tyrecentre/#/about">About us</a>
                      </li>
                      <li>
                        <a href="/">Store location : Jogeshwari Mumbai(102)</a>
                      </li>
                      <li>
                        <a href="#">Contact : ashwinmaurya9211@gmail.com</a>
                      </li>
                      {/* <li>
                        <a href="#">Orders tracking</a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="footer-widget mb-30 ml-50">
                  <div class="footer-title">
                    <h3>USEFUL LINKS</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a href="#">Returns</a>
                      </li>
                      <li>
                        <a href="#">Support Policy</a>
                      </li>
                      <li>
                        <a href="#">Size guide</a>
                      </li>
                      <li>
                        <a href="#">FAQs</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-sm-6">
                <div class="footer-widget mb-30 ml-75">
                  <div class="footer-title">
                    <h3>FOLLOW US</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a
                          class="fa fa-facebook"
                          href="https://www.facebook.com/ASHMI6oo7/"
                        >
                          &nbsp; Facebook
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-linkedin"
                          href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/"
                        >
                          &nbsp; linkedin
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-instagram"
                          href="https://www.instagram.com/ashwin_oo7/"
                        >
                          &nbsp; Instagram
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-youtube"
                          href="https://www.youtube.com/channel/UCXE9IrBDQDwf2If_S6XKKiw"
                        >
                          &nbsp; Youtube
                        </a>
                      </li>
                      <li>
                        <button
                          className="feedback-button"
                          id="feedback-button"
                          onClick={this.toggleFormVisibility}
                        >
                          Leave Feedback
                        </button>
                        {isFormVisible && (
                          <div className="feedback-form">
                            <form onSubmit={this.handleSubmit}>
                              <label htmlFor="feedback">Your Feedback:</label>
                              <textarea
                                id="feedback"
                                name="feedback"
                                rows="4"
                                cols="50"
                                onChange={this.handleChange}
                                placeholder="Enter your feedback here..."
                              ></textarea>
                              <input type="submit" value="Submit" />
                            </form>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="footer-widget mb-30 ml-70">
                  <div class="footer-title">
                    <h3>SUBSCRIBE</h3>
                  </div>
                  <div class="subscribe-style">
                    <p>
                      Get E-mail updates about our latest shop and special
                      offers.
                    </p>
                    <div id="mc_embed_signup" class="subscribe-form">
                      <form
                        id="mc-embedded-subscribe-form"
                        class="validate"
                        novalidate=""
                        target="_blank"
                        name="mc-embedded-subscribe-form"
                        method="post"
                        action="#"
                      >
                        <div id="mc_embed_signup_scroll" class="mc-form">
                          <input
                            class="email"
                            type="email"
                            required=""
                            placeholder="Enter your email here.."
                            name="EMAIL"
                            value=""
                          />
                          <div class="mc-news" aria-hidden="true">
                            <input
                              type="text"
                              value=""
                              tabindex="-1"
                              name="b_6bbb9b6f5827bd842d9640c82_05d85f18ef"
                            />
                          </div>
                          <div class="clear">
                            <input
                              id="mc-embedded-subscribe"
                              class="button"
                              type="submit"
                              name="subscribe"
                              value="Subscribe"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Modal */}
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {this.state.selectedProduct && (
                <div
                  class="modal-body"
                  onClick={() =>
                    this.fetchProductDetails(this.state.selectedProduct)
                  }
                >
                  <div class="row">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                      <div class="tab-content quickview-big-img">
                        <div id="pro-1" class="tab-pane fade show active">
                          <img
                            src={
                              this.state.selectedProduct.productImages[0]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                        {this.state.selectedProduct.productImages.map(
                          (image, index) => (
                            <div
                              id={`pro-${index + 1}`}
                              class={`tab-pane fade ${
                                index === 1 ? "show active" : ""
                              }`}
                            >
                              <img src={image.dataURL} alt="" />
                            </div>
                          )
                        )}

                        <div id="pro-3" class="tab-pane fade">
                          <img
                            src={
                              this.state.selectedProduct.productImages[1]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                        <div id="pro-4" class="tab-pane fade">
                          <img
                            src={
                              this.state.selectedProduct.productImages[1]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                      </div>
                      {/* Thumbnail Large Image End */}
                      {/* Thumbnail Image End */}
                      <div class="quickview-wrap mt-15">
                        <div
                          class="quickview-slide-active owl-carousel nav nav-style-1"
                          role="tablist"
                        >
                          <a class="active" data-bs-toggle="tab" href="#pro-1">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-2">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-3">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-4">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* {this.state.products
                    .filter((prod) => prod.categoryName === "Four Wheeler")
                    .map((prod, index) => ( */}
                    {this.state.selectedProduct && (
                      <div
                        class="col-md-7 col-sm-12 col-xs-12"
                        onClick={() =>
                          this.fetchProductDetails(this.state.selectedProduct)
                        }
                      >
                        <div class="product-details-content quickview-content">
                          <h2>{this.state.selectedProduct.brandName}</h2>
                          <div class="product-details-price">
                            <span>
                              &#8377;{this.state.selectedProduct.productPrice}
                            </span>
                            <span class="old">
                              &#8377;
                              {this.state.selectedProduct.productMrpPrice}
                            </span>
                          </div>
                          <div class="pro-details-rating-wrap">
                            <div class="pro-details-rating">
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <span>3 Reviews</span>
                          </div>
                          <p>
                            {this.state.selectedProduct.categoryName}
                            <br />
                            {this.state.selectedProduct.subCategoryName}
                            <br />
                            {this.state.selectedProduct.productName}
                          </p>
                          <div class="pro-details-list">
                            <ul>
                              <li> {this.state.selectedProduct.tyreSize}</li>
                              {/* <li>- Inspired vector icons</li>
                              <li>- Very modern style </li> */}
                            </ul>
                          </div>
                          <div class="pro-details-size-color">
                            <div class="pro-details-color-wrap">
                              {/* <span>Color</span> */}
                              <div class="pro-details-color-content">
                                <ul>{/* <li class="black"></li> */}</ul>
                              </div>
                            </div>
                            <div class="pro-details-size">
                              {/* <span>Size</span> */}
                              {/* <div class="pro-details-size-content">
                                <ul>
                                  <li>
                                    <a href="#">s</a>
                                  </li>
                                  <li>
                                    <a href="#">m</a>
                                  </li>
                                  <li>
                                    <a href="#">l</a>
                                  </li>
                                  <li>
                                    <a href="#">xl</a>
                                  </li>
                                  <li>
                                    <a href="#">xxl</a>
                                  </li>
                                </ul>
                              </div> */}
                            </div>
                          </div>
                          <div class="pro-details-quality">
                            <div class="cart-plus-minus">
                              <input
                                class="cart-plus-minus-box"
                                type="text"
                                name="qtybutton"
                                value="2"
                              />
                            </div>
                            <div class="pro-details-cart btn-hover">
                              <a
                                href="#"
                                onClick={() =>
                                  this.handleAddToCart(
                                    this.state.selectedProduct
                                  )
                                }
                              >
                                Add To Cart
                              </a>
                            </div>
                            <div class="pro-details-wishlist">
                              <a href="#">
                                <i class="fa fa-heart-o"></i>
                              </a>
                            </div>
                            <div class="pro-details-compare">
                              <a href="#">
                                <i class="pe-7s-shuffle"></i>
                              </a>
                            </div>
                          </div>
                          {/* <div class="pro-details-meta">
                            <span>Categories :</span>
                            <ul>
                              <li>
                                <a href="#">Minimal,</a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                            </ul>
                          </div> */}
                          {/* <div class="pro-details-meta">
                            <span>Tag :</span>
                            <ul>
                              <li>
                                <a href="#"> </a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                            </ul>
                          </div> */}
                          <div class="pro-details-social">
                            <ul>
                              <li>
                                <a href="https://www.facebook.com/ASHMI6oo7/">
                                  <i class="fa fa-facebook"></i>
                                </a>
                              </li>
                              <li>
                                <a href="https://www.youtube.com/@ashwin0401">
                                  <i class="fa fa-youtube"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i class="fa fa-twitter"></i>
                                </a>
                              </li>
                              <br />
                              <li>
                                <a href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/">
                                  <i class="fa fa-linkedin"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Modal end */}
      </div>
    );
  }
}
