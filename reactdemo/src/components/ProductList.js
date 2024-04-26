import React, { Component } from "react";
import axios from "axios";
import "../css/ProductList.css";
import { toast } from "react-toastify";

import {
  FaPencilAlt,
  FaImages,
  FaFolder,
  FaTags,
  FaRupeeSign,
  FaCubes,
  FaIndustry,
  FaBook,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import DeleteConfirmationPopup from "./ProductDeleteConfirmationPopup.js";

import { Link } from "react-router-dom";
// import EditProductModal from "./EditProductModal.js";
// Import the popup/modal component

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProduct: null,
      isEditModalOpen: false,
      isAdmin: false,
      deleteConfirmation: {
        isOpen: false,
        product: null,
      },
      currentPage: 1,
      itemsPerPage: 5,
    };
    this.popupRef = React.createRef();
  }
  componentDidMount() {
    const isAdmin = localStorage.getItem("isAdmin");
    this.setState({ isAdmin });

    if (isAdmin) {
      if (this.state.products) {
        this.fetchAllProducts();
        document.addEventListener("mousedown", this.handleClickOutside);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
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

  handleClickOutside = (event) => {
    if (this.popupRef && !this.popupRef.current.contains(event.target)) {
      this.handleCancelDelete();
    }
  };

  handleDelete = (_id, product) => {
    this.setState({
      deleteConfirmation: {
        isOpen: true,
        product: product,
        productId: _id,
      },
    });
  };

  handleCancelDelete = () => {
    this.setState({
      deleteConfirmation: {
        isOpen: false,
        product: null,
        productId: null,
      },
    });
  };

  handleConfirmDelete = async () => {
    const { product } = this.state.deleteConfirmation;
    const { enteredProductName } = this.state;
    if (enteredProductName.trim() !== product.brandName.trim()) {
      toast.error("Brand name does not match. Deletion cancelled.");
      return;
    }
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + `product/deleteProduct/${product._id}`
      );
      console.log("Response", response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          products: prevState.products.filter((p) => p._id !== product._id),
          deleteConfirmation: {
            isOpen: false,
            product: null,
          },
        }));
        toast.success("deleted successfully ");
        console.log("Product deleted successfully");
      } else {
        // Display an error toast message if the deletion failed
        toast.error("Failed to deleted");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    this.handleCancelDelete();
  };

  fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );
      // console.log("fetchAllProducts Response:", response.data);
      const productList = response.data.reverse();

      this.setState({ products: productList });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleEdit = (product) => {
    this.setState({ selectedProduct: product, isEditModalOpen: true });
    console.log(product);
  };
  handleModalClose = () => {
    this.setState({ isEditModalOpen: false });
  };

  handleSaveChanges = (updatedProduct) => {
    const { products } = this.state;
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    this.setState({ products: updatedProducts, isEditModalOpen: false });
  };

  handleUpdate = async () => {
    const { selectedProduct } = this.state;
    try {
      await axios.put(
        process.env.REACT_APP_API_URL +
          `product/updateProduct/${selectedProduct._id}`,
        selectedProduct
      );
      this.setState({ editedProduct: null });
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  render() {
    const { deleteConfirmation, currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = this.state.products.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return (
      <>
        {this.state.isAdmin ? (
          <div className="product-list">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaImages />
                    {"  "} Image
                  </th>
                  <th>
                    <FaFolder />
                    {"  "}Category
                  </th>
                  <th>
                    {" "}
                    <FaFolder />
                    {"  "}SubCategory
                  </th>
                  <th>
                    <FaTags />
                    {"  "}Brand
                  </th>
                  <th>
                    <FaRupeeSign /> Price
                  </th>
                  <th>
                    <FaCubes /> Quantity
                  </th>
                  <th>
                    <FaIndustry /> Manufacturer
                  </th>
                  <th>
                    <FaBook /> Description
                  </th>
                  <th>
                    <FaEdit /> Edit /
                    <FaTrash />
                  </th>

                  {/* Add more headers as needed */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        title={"Product Image of " + product.brandName}
                        src={product.productImages[0].dataURL}
                        alt={product.productName}
                      />
                    </td>
                    <td>
                      {" "}
                      {product.categoryName.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.categoryName}
                        >
                          {product.categoryName}
                        </div>
                      ) : (
                        product.categoryName
                      )}
                    </td>
                    <td>
                      {product.subCategoryName.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.subCategoryName}
                        >
                          {product.subCategoryName}
                        </div>
                      ) : (
                        product.subCategoryName
                      )}
                    </td>
                    <td>
                      {product.brandName.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.brandName}
                        >
                          {product.brandName}
                        </div>
                      ) : (
                        product.brandName
                      )}
                    </td>
                    <td>
                      {product.productPrice.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.productPrice}
                        >
                          {product.productPrice}
                        </div>
                      ) : (
                        product.productPrice
                      )}
                    </td>
                    <td>
                      {product.productQuantity.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.productQuantity}
                        >
                          {product.productQuantity}
                        </div>
                      ) : (
                        product.productQuantity
                      )}
                    </td>
                    <td>
                      {product.manufacturer.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.manufacturer}
                        >
                          {product.manufacturer}
                        </div>
                      ) : (
                        product.manufacturer
                      )}
                    </td>
                    <td className="des">
                      {product.productDescription.length > 15 ? (
                        <div
                          className="horizontal-scroll"
                          title={product.productDescription}
                        >
                          {product.productDescription}
                        </div>
                      ) : (
                        product.productDescription
                      )}
                    </td>
                    <td>
                      {/* <a href={`/add-product?id=${product.id}`}> */}
                      {/* <i class="fa fa-pencil"></i> */}
                      <Link
                        to={`/add-product?id=${product._id}&id=${product._id}`}
                      >
                        <FaPencilAlt
                          title="Edit the product details"
                          onClick={() => this.handleEdit(product)}
                        />
                      </Link>
                      {"\u2003"}
                      {"\u2003"}
                      {"\u2003"}
                      <FaTrash
                        title="delete the product data"
                        onClick={() => this.handleDelete(product._id, product)}
                      />
                    </td>

                    {/* Add more cells for additional details */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <strong style={{ marginLeft: "2%" }}>
                Item :{indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, this.state.products.length)} of{" "}
                {this.state.products.length}
              </strong>
              <strong style={{ marginLeft: "80%" }}>
                Current Page : {currentPage}
              </strong>
            </div>
            <div className="pagination" style={{ paddingBottom: "10px" }}>
              <button
                style={{ width: "30%", marginLeft: "200px" }}
                onClick={this.prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                style={{ width: "30%", marginLeft: "200px" }}
                onClick={this.nextPage}
                disabled={indexOfLastItem >= this.state.products.length}
              >
                Next
              </button>
            </div>

            <div ref={this.popupRef}>
              <DeleteConfirmationPopup
                isOpen={deleteConfirmation.isOpen}
                product={deleteConfirmation.product}
                onCancel={this.handleCancelDelete}
                onConfirm={this.handleConfirmDelete}
                enteredProductName={this.state.enteredProductName}
                handleChange={(e) =>
                  this.setState({ enteredProductName: e.target.value })
                }
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
export default ProductList;
