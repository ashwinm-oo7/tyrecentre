//ProductController.js
const express = require("express");
const router = express.Router();
const { getBase64Image, saveBase64Image } = require("../Utility/FileUtility");
const db = require("../../../Start/db");
const { ObjectId } = require("mongodb");

/////////////////////////////
router.post("/add", async (req, res) => {
  // console.log("PRODUCTSSS : ", await req.body);

  try {
    const {
      categoryName,
      subCategoryName,
      brandName,
      tyreCompanyDescription,
      productName,
      productPrice,
      productMrpPrice,
      discount,
      productQuantity,
      skuCode,
      manufacturer,
      productDescription,
      tyreSize,
      productImages,
      vehicleBrandModels,
    } = req.body;

    const productPrices = parseFloat(productPrice);
    const productMrpPrices = parseFloat(productMrpPrice);
    const productQuantitys = parseInt(productQuantity);

    // Create a new Product instance with the image file path
    const newProduct = {
      categoryName: categoryName,
      subCategoryName: subCategoryName,
      brandName: brandName,
      // tyreCompanyDescription: tyreCompanyDescription,
      productName: productName,
      productPrice: productPrices,
      productMrpPrice: productMrpPrices,
      discount: discount,
      productQuantity: productQuantitys,
      skuCode: skuCode,
      manufacturer: manufacturer,
      productDescription: productDescription,
      tyreSize: tyreSize,
      vehicleBrandModels: vehicleBrandModels,
      created_at: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      // Add the image file path to the product data
      //   productImages: imageFilePath,
    };
    // productImages.forEach((image) => {
    //   const filePath = saveBase64Image(
    //     image.dataURL,
    //     image.fileName.split("\\.")[0],
    //     image.fileName.split("\\.")[1]
    //   );
    //   image.filePath = filePath;
    //   image.dataURL = null;
    // });

    for (let image of productImages) {
      const fileName = image.fileName;
      const lastDotIndex = fileName.lastIndexOf(".");
      const fileNameWithoutExtension = fileName.slice(0, lastDotIndex);
      const fileExtension = fileName.slice(lastDotIndex + 1);

      // console.log("File name:", fileName);
      // console.log("File name without extension:", fileNameWithoutExtension);
      // console.log("File extension:", fileExtension);

      const filePath = saveBase64Image(
        image.dataURL,
        fileNameWithoutExtension,
        fileExtension
      );
      image.filePath = filePath;
      image.dataURL = null;
      image.size = String(image.size);
      image.status = 1;
    }

    newProduct.productImages = productImages;

    // console.log("PRODUCTTT : ", newProduct);

    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const productCollection = db1.collection("product");
    const savedProduct = await productCollection.insertOne(newProduct);

    // console.log("PRODUCT: ", savedProduct);

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

router.get("/getAllProducts", async (req, res) => {
  try {
    // Fetch all products from the database
    const { products } = req.params;

    // Query all SUBcategories from the database
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const productCollection = db1.collection("product");

    // Send the retrieved categories as JSON response
    const allProducts = await productCollection.find({}).toArray();
    // console.log("ALL PRODUCTS:", allProducts);
    allProducts.forEach((product) => {
      product.productImages.forEach((image) => {
        image.dataURL = getBase64Image(image.filePath);
      });
    });
    res.status(200).json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/getProductsByIds", async (req, res) => {
  try {
    // Extract product IDs from the request query parameters
    const { productIds } = req.query;
    console.log("Extracting product", productIds);
    // Convert product IDs to an array of ObjectIds (assuming you're using MongoDB ObjectId)
    const objectIdArray = productIds.split(",").map((id) => new ObjectId(id));

    // Fetch products from the database based on the provided IDs
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const productCollection = db1.collection("product");

    // Query products by IDs
    const products = await productCollection
      .find({ _id: { $in: objectIdArray } })
      .toArray();

    // If products are found, send them as a JSON response
    console.log("Extracting products", products);
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res
        .status(404)
        .json({ message: "No products found with the provided IDs" });
    }
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/getProductById/:productIdToUpdate", async (req, res) => {
  try {
    const productIdToUpdate = req.params.productIdToUpdate;

    // console.log("ABS", productIdToUpdate);
    // Connect to the database
    const dbInstance = await db.connectDatabase();

    // Get the database instance
    const db1 = await dbInstance.getDb();

    // Get the collection where products are stored
    const productCollection = db1.collection("product");

    // Find the product by its ID
    const product = await productCollection.findOne({
      _id: new ObjectId(productIdToUpdate),
    });
    // console.log("ALL PRODUCTS:", product);

    if (!product) {
      throw new Error("Product not found");
    }

    for (let image of product.productImages) {
      image.dataURL = getBase64Image(image.filePath);
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Update product by ID
router.put("/update/:productId", async (req, res) => {
  try {
    const productIdToUpdate = req.params.productId;
    const updatedProductData = req.body;

    console.log("PRODUCTUPDATE : ", productIdToUpdate);
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const productCollection = db1.collection("product");
    updatedProductData.updated_at = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const updatedProduct = await productCollection.findOneAndUpdate(
      { _id: new ObjectId(productIdToUpdate) },
      { $set: updatedProductData },
      { returnOriginal: false } // Return the updated document
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/deleteProduct/:productId", async (req, res) => {
  try {
    const productIdToDelete = req.params.productId;

    // Connect to the database
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();

    // Get the product collection
    const productCollection = db1.collection("product");

    // Find the product by its ID and delete it
    const deletedProduct = await productCollection.findOneAndDelete({
      _id: new ObjectId(productIdToDelete),
    });

    if (!deletedProduct) {
      throw new Error("Product not found");
    }

    // Respond with a success message
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
