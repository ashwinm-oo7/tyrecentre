// PaymentInfo
import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import SearchResult from "./Search/SearchResult"; // Import the new component

class PaymentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentInfo: [],
      filteredPaymentInfo: [],
      products: [],
      currentPage: 1,
      itemsPerPage: 5,
      searchInput: "",
    };
  }

  componentDidMount() {
    if (localStorage.getItem("userEmail")) {
      this.fetchpaymentInfo();
    } else {
      window.location.href = "/login";
    }
  }

  // fetchpaymentInfo = async () => {
  //   try {
  //     const response = await fetch(
  //       process.env.REACT_APP_API_URL + "payment/getAll"
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch paymentInfo.");
  //     }
  //     const data = await response.json();
  //     console.log("PAYMENT", data);
  //     this.setState({
  //       paymentInfo: data.reverse(),
  //       filteredPaymentInfo: data.reverse(),
  //     });
  //   } catch (error) {
  //     console.error("Error fetching paymentInfo:", error.message);
  //   }
  // };

  // fetchpaymentInfo = async () => {
  //   try {
  //     const { searchInput, currentPage } = this.state;

  //     let url = process.env.REACT_APP_API_URL + "payment/getAll";

  //     if (searchInput) {
  //       url = `${process.env.REACT_APP_API_URL}payment/search?orderId=${searchInput}`;
  //     }

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch paymentInfo.");
  //     }
  //     const data = await response.json();
  //     const newCurrentPage = searchInput ? 1 : currentPage;

  //     console.log("PAYMENT", data);
  //     this.setState({
  //       paymentInfo: data.reverse(),
  //       filteredPaymentInfo: data.reverse(),
  //       currentPage: newCurrentPage,
  //     });
  //     if (searchInput && data.length > 0) {
  //       this.props.history.push("/search-results", { results: data });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching paymentInfo:", error.message);
  //   }
  // };

  fetchpaymentInfo = async () => {
    try {
      const { searchInput, currentPage } = this.state;

      let url = process.env.REACT_APP_API_URL + "payment/getAll";

      if (searchInput) {
        // Construct the search query to match the Order ID
        const searchQuery = { _id: searchInput };

        // Make an API call to search for payments matching the Order ID
        const response = await fetch(
          process.env.REACT_APP_API_URL + "payment/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchQuery),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch paymentInfo.");
        }
        const data = await response.json();

        const newCurrentPage = searchInput ? 1 : currentPage;

        this.setState({
          paymentInfo: data.reverse(),
          filteredPaymentInfo: data.reverse(),
          currentPage: newCurrentPage,
        });

        // Redirect to search result page if search input is provided
        if (searchInput && data.length > 0) {
          this.props.history.push("/search-results", { results: data });
        }
      } else {
        // If no search input, fetch all payments
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch paymentInfo.");
        }
        const data = await response.json();
        console.log("PAYMENT", data.reverse());
        const newCurrentPage = searchInput ? 1 : currentPage;

        this.setState({
          paymentInfo: data.reverse(),
          filteredPaymentInfo: data.reverse(),
          currentPage: newCurrentPage,
        });
      }
    } catch (error) {
      console.error("Error fetching paymentInfo:", error.message);
    }
  };

  handleSearchInputChange = (e) => {
    const searchInput = e.target.value;
    console.log("Search Input:", searchInput);
    this.setState({ searchInput });
  };
  handleSearch = () => {
    this.fetchpaymentInfo();
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  nextPage = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  prevPage = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage - 1,
    }));
  };

  render() {
    const { paymentInfo, currentPage, itemsPerPage, searchInput } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = paymentInfo.slice(indexOfFirstItem, indexOfLastItem);
    const hasSearchResults = currentItems.length > 0 && searchInput !== "";

    return (
      <div className="payment-container">
        <h2>Payment Details</h2>
        <input
          type="text"
          placeholder="Search by OrderID"
          value={searchInput}
          onChange={this.handleSearchInputChange}
        />
        {hasSearchResults && (
          <Routes>
            <Route path="/search-results" element={<SearchResult />} />
          </Routes>
        )}

        <ul>
          {currentItems.map((payment, index) => (
            <li key={index}>
              <div className="card-form">
                <strong>OrderID :</strong> {payment._id}
                <br />
                <strong>User EmailID :</strong> {payment.userEmail}
                <br />
                <strong>Delivery Address :</strong> {payment.deliveryAddress}
                <br />
                <strong>Total Amount :</strong> {payment.amountPaid}
                <br />
                <div className="product-details">
                  <h3>Product Details</h3>
                  <div className="payment-row">
                    <div className="payment-heading">
                      <strong>SR No.</strong>
                    </div>
                    <div className="payment-heading">
                      <strong>Brand Name :</strong>
                    </div>
                    <div className="payment-heading">
                      <strong>Product Name :</strong>
                    </div>
                    <div className="payment-heading">
                      <strong>Unit Price :</strong>
                    </div>
                    <div className="payment-heading">
                      <strong>Tyre Size :</strong>
                    </div>
                  </div>
                  <hr />
                  {payment.products.map((prod, index2) => (
                    <div className="payment-row">
                      <div className="payment-value">{index2 + 1}</div>
                      <div className="payment-value">
                        {prod.brandName && prod.brandName}
                      </div>
                      <div className="payment-value">
                        {prod.productName && prod.productName}
                      </div>
                      <div className="payment-value">
                        {prod.productPrice && prod.productPrice}
                      </div>
                      <div className="payment-value">
                        {prod.tyreSize && prod.tyreSize}
                      </div>
                    </div>
                  ))}
                </div>
                <strong>Payment Method :</strong> {payment.paymentMethod}
                <br />
                {payment.paymentMethod === "CardPayment" && (
                  <div className="card-form payment-details">
                    <strong>Card User Name :</strong> {payment.name}
                    <br />
                    <strong>Card Number :</strong> {payment.cardNumber}
                    <br />
                    <strong>CVV :</strong> {payment.cvv}
                    <br />
                    <strong>Card Expiry Date :</strong> {payment.cardExpiryDate}
                    <br />
                  </div>
                )}
                {payment.selectedUPIApp && (
                  <div className="card-form payment-details">
                    <strong>selectedUPIApp :</strong> {payment.selectedUPIApp}
                    <br />
                  </div>
                )}
                {payment.upiID && (
                  <div className="card-form payment-details">
                    <strong>Payment upiID :</strong> {payment.upiID}
                    <br />
                  </div>
                )}
                {payment.paymentStatus && (
                  <div className="card-form payment-details">
                    <strong>Payment Status :</strong> {payment.paymentStatus}
                    <br />
                  </div>
                )}
                <strong>Submitted Date :</strong> {payment.createdAt}
                <br />
              </div>
            </li>
          ))}
        </ul>
        <div>
          <strong style={{ marginLeft: "2%" }}>
            Item : {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, paymentInfo.length)} of{" "}
            {paymentInfo.length}
          </strong>
          <strong style={{ marginLeft: "80%" }}>Page : {currentPage}</strong>
        </div>
        <div className="pagination" style={{ paddingBottom: "10px" }}>
          <button
            style={{ width: "30%", marginLeft: "200px" }}
            onClick={() => this.handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            style={{ width: "30%", marginLeft: "100px" }}
            onClick={() => this.handlePageChange(currentPage + 1)}
            disabled={indexOfLastItem >= paymentInfo.length}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default PaymentInfo;
