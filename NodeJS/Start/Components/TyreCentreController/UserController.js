const express = require("express");
const router = express.Router();
const db = require("../../../Start/db"); // Import the MongoDB database connection module
const EncryptionDecryption = require("../Utility/EncryptionDecryption");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ashwinmaurya1997@gmail.com", // Your Gmail address
    pass: "", // Your Gmail password
    // pass: process.env.APP_PASSWORD
  },
});

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Check if the email exists in the database
    const existingUser = await customerCollection.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    console.log("OTP ", otp);

    const timestamp = new Date().getTime();
    await customerCollection.updateOne(
      { email: email },
      { $set: { otp: otp, otpTimestamp: timestamp } }
    );

    // Send OTP via email
    await transporter.sendMail({
      from: '"TyreWala" <ashwinmaurya1997@gmail.com>', // Replace with your organization name
      replyTo: `"TyreWala"<do-not-reply@TyreWala.in>`,
      to: email,
      subject: "Password Reset OTP",
      //     html: `
      //     <p><strong><a href="www.tyrewala.in">TyreWala</a></strong></p>
      //     <p>Do not share the OTP with anyone else.</p>
      //     <p>Your OTP for password reset is: ${otp}</p>
      //     <p>Do not reply this is auto generated.</p>
      //     </p>
      //  `,
      html: `
      <html>
        <head>
          <style>
            body {
              background: url('path_to_tiled_background_image.jpg');
              background-repeat: repeat; /* Ensure the background image tiles */
              background-color: black;
            }
            .red-bold {
              color: red;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
        <div style="display: flex; align-items: center;">
        <div style="flex: 0 0 auto; margin-right: 20px;">
        <img src="https://img.freepik.com/premium-vector/tires-logo-icon-design_775854-1746.jpg" alt="TyreWala Logo" style="display: block; margin: 0 auto; width: 40px; height: auto;">
        </div>
        <div style="flex: 1;">  
          <p><strong><a href="www.tyrewala.in" class="red-bold">TyreWala</a></strong></p>
          <p class="red-bold">Do not share the OTP with anyone else.</p>
          <p>Your OTP for password reset is:<h1> ${otp} </h1></p>
          <p>Do not reply; this is auto-generated.</p>
       </div>
       </div>
        </body>
      </html>
    `,
    });

    res.status(200).json({ message: "OTP sent successfully" });

    setTimeout(async () => {
      await customerCollection.updateOne(
        { email: email },
        { $unset: { otp: "", otpTimestamp: "" } }
      );
    }, 60000); // 60000 milliseconds = 1 minute
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Verify OTP (in a real-world scenario, you'd store OTPs in a database)
    // For simplicity, we'll assume the OTP is correct
    const user = await customerCollection.findOne({ email });

    // Check if OTP is expired
    const currentTimestamp = new Date().getTime();
    const otpTimestamp = user.otpTimestamp;
    if (currentTimestamp - otpTimestamp > 60000) {
      // 60000 milliseconds = 1 minute
      return res
        .status(400)
        .json({ message: "OTP expired. Please resend OTP." });
    }

    const storedOTP = user.otp.toString(); // Convert stored OTP to string
    const providedOTP = otp.toString(); // Convert provided OTP to string
    console.log("Stored OTP:", storedOTP);
    console.log("Provided OTP:", providedOTP);

    if (storedOTP !== providedOTP) {
      console.log("OTP comparison failed");
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Encrypt the new password before updating it in the database
    const encryptedNewPassword = await EncryptionDecryption.encrypt(
      newPassword
    );
    const update_at = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Update the user's password in the database
    const updatedUser = await customerCollection.updateOne(
      { email: email },
      {
        $set: {
          password: encryptedNewPassword,
          otp: null,
          otpTimestamp: null,
          update_at: update_at,
        },
      }
    );

    console.log("OTPPASSWORD", updatedUser);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

router.post("/emailExists", async (req, res) => {
  try {
    const { email } = req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Check if the email exists in the database
    const existingUser = await customerCollection.findOne({ email });

    if (existingUser) {
      // Email exists
      return res.status(200).json({ exists: true });
    } else {
      // Email does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking if email exists:", error);
    res.status(500).json({ message: "Failed to check email existence" });
  }
});

router.put("/changePassword/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Retrieve the user by ID from the database
    const user = await customerCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt the stored password and compare it with the old password provided by the user
    let dbUserPass = "";
    await EncryptionDecryption.decrypt(user.password).then(
      (encryptedPassword) => {
        dbUserPass = encryptedPassword;
      }
    );

    if (dbUserPass !== oldPassword) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Encrypt the new password before updating it in the database
    const encryptedNewPassword = await EncryptionDecryption.encrypt(
      newPassword
    );

    // Update the user's password in the database
    const updatedUser = await customerCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: encryptedNewPassword } }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});

router.post("/signup", async (req, res) => {
  // console.log("API Called from REACT JS");

  try {
    // const createdAt = new Date(Date.now() + 330 * 60 * 1000);
    const createdAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const entity = req.body;
    entity.createdAt = createdAt;
    // console.log(entity.password);

    let encPwd = "";
    await EncryptionDecryption.encrypt(entity.password).then(
      (encryptedPassword) => {
        console.log("Plain encrypted string password:", encryptedPassword);
        encPwd = encryptedPassword;
      }
    );
    // console.log("ENCPWD", await encPwd);
    entity.password = await encPwd;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();

    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Perform database operation to create a new customer
    const savedCustomer = await customerCollection.insertOne(entity);
    // console.log("DETAILS NOW : ", savedCustomer, "ENTITY", entity);
    const otp = generateOTP();
    const timestamp = new Date().getTime();
    await customerCollection.updateOne(
      { email: entity.email },
      { $set: { otp: otp, otpTimestamp: timestamp } }
    );

    await transporter.sendMail({
      from: '"TyreWala" <ashwinmaurya1997@gmail.com>', // Replace with your organization name
      replyTo: `"TyreWala"<do-not-reply@TyreWala.in>`,
      to: entity.email,
      subject: "TyreWala : OTP for Email Verification",
      html: `
      <div style="display: flex; align-items: center;">
      <div style="flex: 0 0 auto; margin-right: 20px;">
      <img src="https://i.ibb.co/TLN0B5q/tyrelogo.jpg" title="tyrewala" alt="TyreWala Logo" style="display: block; margin: 0 auto; width: 40px; height: auto;">
      </div>
      <div style="flex: 1;">
      <p><strong><a href="www.tyrewala.in" class="red-bold"  title="www.tyrewala.in">TyreWala</a></strong></p>
      <p>Your OTP for email verification is:<h1> ${otp} </h1></p>
      <p>Do not share this OTP with anyone else.</p>








      <p><a href="https://www.instagram.com/ashwin_oo7?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="><img src="https://cdn-icons-png.flaticon.com/512/3621/3621435.png" title="follow us on instagram" alt="Instagram" width="25px" height="25px"></a></p>
      <p><a href="https://www.facebook.com/ASHMI6oo7/"><img src="https://img.freepik.com/free-psd/3d-square-with-facebook-logo_125540-1565.jpg" title="follow us on facebook" alt="facebook" width="25px" height="25px"></a></p>

    </div>
    </div>
      `,
      headers: {
        "signed-by": "TyreWala.in",
      },
    });

    setTimeout(async () => {
      const user = await customerCollection.findOne({ email: entity.email });
      if (user && user.verify !== true) {
        // User didn't verify OTP within one minute, delete the signup details
        await customerCollection.deleteOne({ email: entity.email });
        console.log(
          "Signup details deleted for unverified user:",
          entity.email
        );
      }
    }, 60000); // 60000 milliseconds = 1 minute

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json("Failed to signup. Please try again later.");
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Retrieve the user by email from the database
    const user = await customerCollection.findOne({ email });
    // const storedOTP = user.otp.toString();
    console.log("USEREMAIL", user, "OTP GENERAE,otp", otp);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentTimestamp = new Date().getTime();
    const otpTimestamp = user.otpTimestamp;
    if (currentTimestamp - otpTimestamp > 60000) {
      // 60000 milliseconds = 1 minute
      return res
        .status(400)
        .json({ message: "OTP expired. Please resend OTP." });
    }

    if (!user.otp) {
      console.error("No OTP found for user:", user);
      return res.status(400).json({ message: "No OTP found for user" });
    }

    // Check if the provided OTP matches the stored OTP
    if (user.otp.toString() !== otp.toString()) {
      console.error("Invalid OTP for user:", user);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the provided OTP matches the stored OTP
    // Reset the OTP and OTP timestamp in the database
    await customerCollection.updateOne(
      { email: email },
      { $set: { otp: null, otpTimestamp: null, verify: true } }
    );

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = await req.body;

    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    console.log("Successfully connected to the database");

    try {
      const db1 = await dbInstance.getDb();
      const customerCollection = db1.collection("customer");

      // Now you can perform database operations using customerCollection
      const query = { email: email };

      const cursor = await customerCollection.findOne(query);
      if (!cursor) {
        // If user not found in the database, return 404 status
        return res.status(404).json("Customer not found");
      }

      // console.log("Cursor", cursor);
      let dbUserPass = "";
      EncryptionDecryption.decrypt(cursor.password).then(
        (encryptedPassword) => {
          // console.log("Plain decrypt string password:", encryptedPassword);
          dbUserPass = encryptedPassword;
          // console.log("dbUserPass :", dbUserPass);
          // console.log("req.body.password :", req.body.password);
          // console.log(
          //   "req.body.passwordasdda :",
          //   dbUserPass != req.body.password
          // );
          if (dbUserPass != req.body.password) {
            return res.status(401).json("Credentials issue !");
          }

          if (cursor) {
            return res.status(200).json(cursor);
          } else {
            return res.status(404).json("Customer not found");
          }
        }
      );
    } catch (error) {
      console.error("Error while fetching profile:", error);
    }
    // Perform database operation to find customer by ID
  } catch (error) {
    console.error("Error while fetching profile:", error.message);
    return res
      .status(500)
      .json("Failed to fetch profile. Please try again later.");
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID parameter is missing" });
    }

    // const customer = await Customer.findById(id);
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    // Find the user profile by ID
    const customer = await customerCollection.findOne({
      _id: new ObjectId(id),
    });
    // console.log("USER", customer);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch profile. Please try again later." });
  }
});

// PUT update user profile by ID
router.put("/profile/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedProfile = req.body;
    updatedProfile.update_at = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // console.log("Userid or Update", userId, updatedProfile);

    // const updatedUser = await Customer.findByIdAndUpdate(
    //   userId,
    //   updatedProfile,
    //   { new: true }
    // );

    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const customerCollection = db1.collection("customer");

    const updatedUser = await customerCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedProfile }
    );

    if (Object.keys(updatedProfile).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

router.get("/getAllProfile", async (req, res) => {
  try {
    // Access the MongoDB database instance
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const categoryCollection = db1.collection("customer");

    const profiles = await categoryCollection.find().toArray();
    // console.log("ALLPROFILE", profiles);
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

module.exports = router;
