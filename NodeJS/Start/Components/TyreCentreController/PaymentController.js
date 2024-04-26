const express = require("express");
const router = express.Router();
const db = require("../../../Start/db");
const { ObjectId } = require("mongodb");

// Route to add payment details
router.post("/add", async (req, res) => {
  try {
    const {
      userEmail,
      deliveryAddress,
      paymentMethod,
      amountPaid,
      name,
      cardNumber,
      cvv,
      expiryDates,
      upiID,
      selectedUPIApp,
      paymentUpdate, // New field for Cash on Delivery payment status
      products,
    } = req.body;

    // Validate the payment details
    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Delivery address & Payment Information is required",
      });
    }
    if (paymentMethod === "CashOnDelivery") {
      if (!paymentUpdate) {
        return res.status(400).json({
          message: "Please select payment status for Cash on Delivery.",
        });
      }
      // You can add additional validations specific to Cash on Delivery here
    }

    const parsedAmountPaid = parseFloat(amountPaid);

    // Get current timestamp
    const createdAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Include common fields in the payment object
    const paymentWithDate = {
      userEmail,
      deliveryAddress,
      paymentMethod,
      amountPaid: parsedAmountPaid,
      products,
      createdAt,
    };

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const paymentCollection = db1.collection("order");

    if (paymentMethod === "Online") {
      // Handle online payments
      if (selectedUPIApp) {
        // Save selected UPI app
        paymentWithDate.selectedUPIApp = selectedUPIApp;
      } else if (upiID) {
        // Save UPI ID
        paymentWithDate.upiID = upiID;
      }

      // Insert payment details into the database
      const result = await paymentCollection.insertOne(paymentWithDate);

      res.status(200).json({
        message: "Payment submitted successfully",
        paymentId: result.insertedId,
      });
    } else if (paymentMethod === "CardPayment") {
      // Handle card payments
      if (!name || !cardNumber || !cvv || !expiryDates) {
        return res.status(400).json({ message: "Incomplete card details" });
      }

      paymentWithDate.name = name;
      paymentWithDate.cardNumber = cardNumber;
      paymentWithDate.cvv = cvv;
      paymentWithDate.cardExpiryDate = expiryDates;

      // Insert payment details into the database
      const result = await paymentCollection.insertOne(paymentWithDate);

      res.status(200).json({
        message: "Payment submitted successfully",
        paymentId: result.insertedId,
      });
    } else if (paymentMethod === "CashOnDelivery") {
      paymentWithDate.paymentStatus = paymentUpdate;

      const result = await paymentCollection.insertOne(paymentWithDate);

      res.status(200).json({
        message: "Payment submitted successfully",
        paymentId: result.insertedId,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
    res.status(500).json({
      message: "Failed to submit payment. Please try again later.",
    });
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     const dbInstance = await db.connectDatabase();
//     const db1 = await dbInstance.getDb();

//     const paymentCollection = db1.collection("order");
//     const payments = await paymentCollection.find({}).toArray();
//     console.log(payments);

//     for (let i = 0; i < payments.length; i++) {
//       const productIds = payments[i].products
//         .map((product) => product)
//         .join(",");
//       const objectIdArray = productIds.split(",").map((id) => new ObjectId(id));
//       const dbInstance = await db.connectDatabase();
//       const db1 = await dbInstance.getDb();
//       const productCollection = db1.collection("product");
//       const products = await productCollection
//         .find({ _id: { $in: objectIdArray } })
//         .toArray();
//       payments[i].products = products;
//     }
//     res.status(200).json(payments);
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     res.status(500).json({
//       message: "Failed to fetch payment details. Please try again later.",
//     });
//   }
// });

router.get("/getAll", async (req, res) => {
  try {
    const { orderId } = req.query;
    let query = {}; // Default query to fetch all payment details

    // If orderId is provided, construct a query to filter by OrderID
    if (orderId) {
      query = { _id: ObjectId(orderId) };
    }

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();

    const paymentCollection = db1.collection("order");

    // Fetch payment details based on the constructed query
    const payments = await paymentCollection.find(query).toArray();

    // If orderId is provided, populate product details for each payment
    for (let i = 0; i < payments.length; i++) {
      const productIds = payments[i].products
        .map((product) => product)
        .join(",");
      const objectIdArray = productIds.split(",").map((id) => new ObjectId(id));

      // Fetch products from the database based on the provided IDs
      const productCollection = db1.collection("product");

      // Query products by IDs
      const products = await productCollection
        .find({ _id: { $in: objectIdArray } })
        .toArray();
      payments[i].products = products;
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      message: "Failed to fetch payment details. Please try again later.",
    });
  }
});

module.exports = router;
