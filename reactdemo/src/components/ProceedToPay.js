import React, { Component } from "react";
import "../css/Proceedtopay.css";
import {
  FaUser,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaMobileAlt,
} from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import jsPDF from "jspdf";

class ProceedToPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      deliveryAddress: "",
      paymentMethod: "",
      userEmail: localStorage.getItem("userEmail"),
      showForm: false,
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      name: "",
      cardNumber: "",
      upiID: "",
      upiPaymentOption: "",
      selectedUPIApp: "",
      paymentUpdate: "",
      totalQuantity: 0,
    };
    // const { cart } = this.props;
  }
  calculateTotalQuantity = () => {
    const { cart } = this.props;
    let totalQuantity = 0;
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      console.log("Brand Name:", item.brandName);
      console.log("Model:", item.productName);
    });
    this.setState({ totalQuantity });
  };
  componentDidMount() {
    this.calculateTotalQuantity(); // Calculate total quantity when component mounts
  }
  componentDidUpdate(prevProps) {
    // Check if the cart prop has changed
    if (prevProps.cart !== this.props.cart) {
      // Recalculate total quantity when the cart prop changes
      console.log("CART", this.props.cart);
      this.calculateTotalQuantity();
    }
  }
  handleProceedToPay = () => {
    if (this.state.userEmail) {
      this.setState({ showForm: true });
    } else {
      const confirmed = window.confirm("Please login to proceed to payment.");
      if (confirmed) {
        // Redirect to login page
        window.location.href = "/login";
      } else {
        // User cancelled login
        alert("Prpceed cancelled.");
      }
    }
  };

  handlePayment = async () => {
    const {
      userEmail,
      deliveryAddress,
      paymentMethod,
      cvv,
      expiryMonth,
      expiryYear,
      name,
      cardNumber,
      upiID,
      selectedUPIApp,
      paymentUpdate,
    } = this.state;
    const { finalAmount, cart } = this.props;
    // const products = cart.map((item) => item._id);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryMonthInt = parseInt(expiryMonth, 10);
    const expiryYearInt = parseInt(expiryYear, 10);
    if (!userEmail) {
      alert(` Please Login! `);
    }
    if (deliveryAddress.length < 30) {
      alert("Delivery address must be at least 30 characters long.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === "CardPayment") {
      if (!name) {
        alert("Please enter a valid name ");
        return;
      }
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Please enter a valid card number 16 digits");
        return;
      }
      if (!cvv || cvv.length !== 3) {
        alert("Please enter a valid CVV (3 digits).");
        return;
      }

      if (!expiryMonth || !expiryYear) {
        alert("Please enter a valid expiry date mm yyyy.");
        return;
      }
    }
    if (
      paymentMethod === "CardPayment" &&
      (expiryYearInt < currentYear ||
        (expiryYearInt === currentYear && expiryMonthInt < currentMonth))
    ) {
      alert("Please enter a valid expiry date.");
      return;
    }

    if (paymentMethod === "CashOnDelivery") {
      // Handle Cash on Delivery payment
      if (!paymentUpdate) {
        alert("Please select payment status for Pay on Delivery.");
        return;
      }
    }
    if (paymentMethod === "Online") {
      if (!selectedUPIApp && !upiID) {
        alert("Please select either Your UPI Apps or provide UPI ID.");
        return;
      }
    }
    try {
      // Make API call to store payment information
      const response = await fetch(
        process.env.REACT_APP_API_URL + "payment/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            deliveryAddress,
            paymentMethod,
            amountPaid: finalAmount,
            products: cart.map((item) => item._id),
            ...(selectedUPIApp && { selectedUPIApp }),
            ...(upiID && { upiID }),
            ...(name && { name }),
            ...(cardNumber && { cardNumber }),
            ...(cvv && { cvv }),
            ...(expiryMonth &&
              expiryYear && { expiryDates: `${expiryMonth}/${expiryYear}` }),
            ...(paymentUpdate && { paymentUpdate }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to store payment information.");
      }

      // Alert user about successful payment
      if (paymentUpdate === "PaymentPending") {
        alert(
          `Payment Pending! Your order will be delivered to: ${deliveryAddress} \nPayment Method: ${paymentMethod}\nAmount Paid: ${finalAmount}`
        );
      } else if (paymentUpdate === "PaymentReceived") {
        alert(
          `Payment Received! Your  order will be delivered to: ${deliveryAddress} \nPayment Method: ${paymentMethod}\nAmount paid: ${finalAmount}    `
        );
      } else {
        alert(
          `Payment successful! Your order will be delivered to: ${deliveryAddress}\nPayment Method: ${paymentMethod}\nAmount Paid: ${finalAmount}`
        );
      }

      this.setState({
        userEmail: "",
        deliveryAddress: "",
        paymentMethod: "",
        cvv: "",
        expiryMonth: "",
        expiryYear: "",
        name: "",
        cardNumber: "",
        upiID: "",
        selectedUPIApp: "",
        paymentUpdate: "",
      });
    } catch (error) {
      console.error("Error storing payment information:", error.message);
      alert("Payment failed. Please try again later.");
    }

    const response = await fetch(
      process.env.REACT_APP_API_URL + "payment/getAll"
    );
    const data = await response.json();
    const data1 = data.reverse();
    console.log("Now", data1[0]);
    const productsInfo = data1[0].products
      .map((product, index) => {
        return `Product ${index + 1}:
    Brand Name: ${product.brandName}
    Model:      ${product.productName}
    Tyre Size:  ${product.tyreSize}
    Price:      ${product.productPrice}\n`;
      })
      .join("");

    const splitAddress = (address) => {
      const maxCharactersPerLine = 15;
      const lines = [];
      let currentLine = "";
      address.split(" ").forEach((word) => {
        if ((currentLine + word).length > maxCharactersPerLine) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
        currentLine += word + " ";
      });
      lines.push(currentLine.trim());
      return lines.join("\n");
    };

    // Example usage
    const formattedDeliveryAddress = splitAddress(deliveryAddress);
    const paymentDetails = `
        Date: ${data1[0].createdAt}
        OrderID: ${data1[0]._id}
        User Email: ${userEmail}
        Delivery Address: ${formattedDeliveryAddress}
        Payment Method: ${paymentMethod}
    
        Products:
        ${productsInfo}
    
        Final Amount: ${finalAmount}
    `;

    // Create a Blob containing the payment details text
    const blob = new Blob([paymentDetails], { type: "text/plain" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "payment_details.txt"; // File name
    downloadLink.style.display = "none";

    // Append the download link to the document body and trigger the download
    document.body.appendChild(downloadLink);
    // downloadLink.click();

    // Clean up: remove the download link from the document body
    document.body.removeChild(downloadLink);

    const generatePDF = (paymentDetails) => {
      const doc = new jsPDF();

      doc.setFillColor(173, 216, 230); // Light blue color
      doc.rect(
        0,
        0,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height,
        "F"
      );

      doc.setTextColor(173, 226, 250); // Transparent text color

      doc.setFontSize(5);
      const text = "TyreWala ";
      const textWidth =
        doc.getStringUnitWidth(text) * doc.internal.getFontSize();
      const textHeight = doc.internal.getLineHeight();
      const margin = 10;
      const patternCols = Math.ceil(doc.internal.pageSize.width / textWidth);
      const patternRows = Math.ceil(doc.internal.pageSize.height / textHeight);
      for (let i = 0; i < patternCols; i++) {
        for (let j = 0; j < patternRows; j++) {
          doc.text(text, margin + i * textWidth, margin + j * textHeight);
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 0, 0); // Red color
      doc.setFontSize(20);
      doc.text("TyreWala", 10, 15); // Name: TyreWala

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Black color
      doc.setFontSize(20);
      doc.text("INVOICE", 95, 10); // Name: TyreWala

      doc.setTextColor(0, 0, 0); // Black color
      doc.setFontSize(12);
      doc.text(paymentDetails, 10, 30); // Add payment details to PDF

      const imgWidth = 25; // Adjust image width as needed
      const imgHeight = 12; // Adjust image height as needed
      const imgData = "https://i.ibb.co/TLN0B5q/tyrelogo.jpg"; // Base64 encoded image data
      const x = doc.internal.pageSize.width - imgWidth - 10; // Position from right edge
      const y = 10; // Position from top edge
      doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

      doc.save("payment_details.pdf"); // Save PDF with specified file name
    };

    generatePDF(paymentDetails);
  };

  handleCVVChange = (e) => {
    const cvv = e.target.value.replace(/\D/g, "");
    this.setState({ cvv });
  };

  handleExpiryDateChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleNameChange = (e) => {
    const name = e.target.value;
    this.setState({ name });
  };

  handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ");
    value = value.slice(0, 19);
    this.setState({ cardNumber: value.trim() });
  };

  handleUPIIDChange = (e) => {
    const upiID = e.target.value;
    const isValidFormat = upiID;
    this.setState({ upiID, isValidFormat });
  };

  handleUPIPaymentOptionChange = (e) => {
    const upiPaymentOption = e.target.value;
    this.setState({ upiPaymentOption });
  };

  handleSelectedUPIAppChange = (e) => {
    const selectedUPIApp = e.target.value;
    this.setState({ selectedUPIApp });
  };
  handlePaymentUpdateChange = (e) => {
    const paymentUpdate = e.target.value;
    this.setState({ paymentUpdate });
  };

  render() {
    const { cart } = this.props;

    const {
      deliveryAddress,
      paymentMethod,
      showForm,
      cvv,
      expiryMonth,
      expiryYear,
      name,
      cardNumber,
      upiID,
      isValidFormat,
      upiPaymentOption,
      selectedUPIApp,
      paymentUpdate,
      totalQuantity,
    } = this.state;
    const { finalAmount } = this.props;
    const monthOptions = [
      <option key="0" value="" selected>
        MM
      </option>,
      ...Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, "0");
        return (
          <option key={month} value={month}>
            {month}
          </option>
        );
      }),
    ];

    // Generate options for year dropdown (current year to next 10 years)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryMonthInt = parseInt(expiryMonth, 10);
    const expiryYearInt = parseInt(expiryYear, 10);

    const currentYear = new Date().getFullYear();
    const yearOptions = [
      <option key="0" value="" selected>
        YYYY
      </option>, // Placeholder
      ...Array.from({ length: 21 }, (_, i) => {
        const year = currentYear + i;
        return (
          <option key={year} value={year}>
            {year}
          </option>
        );
      }),
    ];

    return (
      <div>
        <button
          className="proceed"
          style={{ width: "20%" }}
          onClick={this.handleProceedToPay}
        >
          Proceed to pay
        </button>
        {showForm && (
          <div className="payment-form">
            <strong style={{ marginRight: "110px" }}>
              <FaUser /> User Email :{" "}
            </strong>
            <strong>{localStorage.getItem("userEmail")}</strong>
            <br />
            {cart.map((item, index) => (
              <div key={index}>
                <strong style={{ marginRight: "120px" }}>Brand Name :</strong>
                <strong>{item.brandName}</strong>
                <br />
                <strong style={{ marginRight: "160px" }}>Model :</strong>
                <strong>{item.productName}</strong>
                <br />
                <strong style={{ marginRight: "145px" }}>Tyre Size :</strong>
                <strong>{item.tyreSize}</strong>
                <br />
                <strong style={{ marginRight: "145px" }}>Price/pcs :</strong>
                <strong>{item.productPrice}</strong>
                <br />

                {/* <p>Model: {item.productName}</p> */}
                {/* Display other details here */}
                <hr />
              </div>
            ))}
            <strong style={{ marginRight: "150px" }}>Total Quantity :</strong>
            <strong>{totalQuantity}</strong>
            <br />
            <strong style={{ marginRight: "50px" }}>
              <FaRupeeSign /> Final Amount to Pay :
            </strong>
            <strong>
              {" "}
              <FaRupeeSign />
              {finalAmount}
            </strong>
            <br />
            <strong>
              {" "}
              <FaTruck />
              Delivery Address<span style={{ color: "red" }}>*</span> :{" "}
            </strong>
            <input
              style={{
                marginLeft: "45px",
                borderColor: deliveryAddress.length > 30 ? "" : "red",
              }}
              type="text"
              value={deliveryAddress}
              onChange={(e) =>
                this.setState({ deliveryAddress: e.target.value })
              }
              placeholder="Enter your delivery address"
            />{" "}
            <FaMapMarkerAlt />
            <br />
            <strong>
              {" "}
              <FaCreditCard />
              Select Payment Method<span style={{ color: "red" }}>
                *
              </span> :{" "}
            </strong>{" "}
            <select
              value={paymentMethod}
              onChange={(e) => this.setState({ paymentMethod: e.target.value })}
              style={{ borderColor: paymentMethod ? "" : "red" }}
            >
              <option value="">Select payment method</option>
              <option value="Online">Online Payment</option>
              <option value="CashOnDelivery">Pay on Delivery</option>
              <option value="CardPayment">Card Payment</option>
            </select>
            {paymentMethod === "CardPayment" && (
              <div className="card-form">
                <>
                  <br />
                  <strong style={{ marginRight: "143px" }}>
                    Name<span style={{ color: "red" }}>*</span>:{" "}
                  </strong>
                  <input
                    type="text"
                    value={name}
                    onChange={this.handleNameChange}
                    placeholder="Enter your name"
                    style={{ borderColor: name ? "" : "red" }}
                  />
                  <br />

                  {/* Card Number */}
                  <strong style={{ marginRight: "93px" }}>
                    Card Number<span style={{ color: "red" }}>*</span>:{" "}
                  </strong>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={this.handleCardNumberChange}
                    placeholder="Enter card number"
                    style={{
                      borderColor: cardNumber.length === 19 ? "" : "red",
                    }}
                  />
                  <br />
                  <strong>
                    CVV<span style={{ color: "red" }}>*</span> :{" "}
                  </strong>
                  <input
                    style={{
                      width: "17%",
                      borderColor: cvv.length === 3 ? "" : "red",
                    }}
                    type="text"
                    value={cvv}
                    onChange={this.handleCVVChange}
                    placeholder="Enter CVV"
                  />
                  {"    "}
                  <strong>
                    Expiry Date<span style={{ color: "red" }}>*</span> :{" "}
                  </strong>
                  <select
                    style={{
                      width: "15%",
                      borderColor:
                        (expiryYearInt === currentYear &&
                          expiryMonthInt >= currentMonth) ||
                        expiryYearInt > currentYear
                          ? ""
                          : "red",
                    }}
                    title="select the month of expiry card"
                    name="expiryMonth"
                    value={expiryMonth}
                    onChange={this.handleExpiryDateChange}
                  >
                    {monthOptions}
                  </select>
                  <strong> {" /"}</strong>
                  <select
                    style={{
                      width: "15%",
                      borderColor: expiryYear ? "" : "red",
                    }}
                    title="select the year of expiry card"
                    name="expiryYear"
                    value={expiryYear}
                    onChange={this.handleExpiryDateChange}
                  >
                    {yearOptions}
                  </select>
                </>
              </div>
            )}
            {paymentMethod === "Online" && (
              <div className="card-form">
                <>
                  <br />
                  <strong>
                    {" "}
                    <FaMobileAlt />
                    UPI Payment Option
                    <span style={{ color: "red" }}>*</span> :
                  </strong>
                  <select
                    value={upiPaymentOption}
                    onChange={this.handleUPIPaymentOptionChange}
                    style={{
                      marginLeft: "8px",
                      borderColor: upiPaymentOption ? "" : "red",
                    }}
                  >
                    <option value="">Select UPI Payment Option</option>
                    <option value="Your UPI Apps">Your UPI Apps</option>
                    <option value="UPI ID">UPI ID</option>
                  </select>
                  {upiPaymentOption === "Your UPI Apps" && (
                    <>
                      <br />
                      <strong>
                        Select UPI App<span style={{ color: "red" }}>*</span> :
                      </strong>
                      <select
                        value={selectedUPIApp}
                        onChange={this.handleSelectedUPIAppChange}
                        style={{
                          marginLeft: "45px",
                          borderColor: selectedUPIApp ? "" : "red",
                        }}
                      >
                        <option value="">Select UPI App</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="PayTm">PayTm</option>
                        <option value="GooglePay">GooglePay</option>
                      </select>
                    </>
                  )}
                  {upiPaymentOption === "UPI ID" && (
                    <>
                      <br />
                      <strong>
                        UPI ID<span style={{ color: "red" }}>*</span> :{" "}
                      </strong>
                      <input
                        type="text"
                        value={upiID}
                        onChange={this.handleUPIIDChange}
                        placeholder="Enter UPI ID"
                        style={{
                          marginLeft: "97px",
                          borderColor: isValidFormat ? "" : "red",
                        }}
                      />
                      {isValidFormat ? null : (
                        <p style={{ color: "red" }}>
                          Please enter a valid UPI ID format: UserName@BankName
                          or PhoneNumber@BankName
                        </p>
                      )}
                    </>
                  )}
                </>
              </div>
            )}
            <br />{" "}
            {paymentMethod === "CashOnDelivery" && (
              <div className="card-form">
                <br />
                <strong>
                  <GiDeliveryDrone />
                  Pay on Delivery Status
                  <span style={{ color: "red" }}>*</span> :{"   "}
                </strong>
                <select
                  value={paymentUpdate}
                  onChange={this.handlePaymentUpdateChange}
                  style={{
                    color:
                      paymentUpdate === "PaymentReceived" ? "green" : "red",
                  }}
                >
                  <option value="">Select payment status</option>
                  <option value="PaymentPending">Payment Pending</option>
                  <option value="PaymentReceived">Payment Received</option>
                </select>
                <FaMobileAlt />
              </div>
            )}
            <br />
            <button style={{ width: "" }} onClick={this.handlePayment}>
              Proceed
            </button>{" "}
            {/* Button to proceed with payment */}
          </div>
        )}
      </div>
    );
  }
}

export default ProceedToPay;
