  import React, { Component } from 'react';
  import axios from 'axios';
  import '../css/ProductList.css';
  import { FaPencilAlt,FaTrash } from 'react-icons/fa'; // Import pencil icon from react-icons library
  import EditProductModal from './EditProductModal.js'; 
  // Import the popup/modal component

  class ProductList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        products: [],
        selectedProduct: null,
        isEditModalOpen: false,
      };
      this.fetchAllProducts();
    }

    fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/product/getAllProducts');
        console.log('fetchAllProducts Response:', response.data);
        this.setState({ products: response.data });
      } catch (error) {
        console.error('Error fetching products:', error);
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
      const updatedProducts = products.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      this.setState({ products: updatedProducts, isEditModalOpen: false });
    };


    handleUpdate = async () => {
      const { products, selectedProduct, isEditModalOpen } = this.state;
      try {
        await axios.put(`http://localhost:8080/product/updateProduct/${selectedProduct.id}`, selectedProduct);
        this.setState({ editedProduct: null });
        console.log('Product updated successfully');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    render() {
      const { editedProduct, isModalOpen } = this.state;
  // In ProductList.js
  const { selectedProduct, isEditModalOpen , products } = this.state;

      return (
        <div className="product-list">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Manufacturer</th>
                <th>Description</th>
                <th>Edit</th>

                {/* Add more headers as needed */}
              </tr>
            </thead>
            <tbody>
              {this.state.products.map((product, index) => (
                <tr key={index}>
                  <td><img src={product.productImages[0].dataURL} alt={product.productName} /></td>
                  <td>{product.categoryName}</td>
                  <td>{product.subCategoryName}</td>
                  <td>{product.brandName}</td>
                  <td>{product.productPrice}</td>
                  <td>{product.productQuantity}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.productDescription}</td>
                  <td>
                  <a href={`/add-product?id=${product.id}`}> <i class="fa fa-pencil"></i></a>
                    {/* <FaPencilAlt onClick={() => this.handleEdit(product)} /> */}
                  </td>

                  {/* Add more cells for additional details */}
          

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      );
    }
  }

  export default ProductList;


  


































































  // import React, { Component } from 'react';
  // import axios from 'axios';
  // import '../css/ProductList.css';

  // class ProductList extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       products: [],
  //       editedProduct: null
  //     };
  //     this.fetchAllProducts();
  //   }

  //   fetchAllProducts = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8080/product/getAllProducts');
  //       console.log('fetchAllProducts Response:', response.data);
  //       this.setState({ products: response.data });
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };

  //   handleEdit = (productIndex, field) => {
  //     this.setState({ editedProduct: { index: productIndex, field: field } });
  //   };

  //   handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     const { index, field } = this.state.editedProduct;
  //     const updatedProducts = [...this.state.products];
  //     updatedProducts[index][field] = value;
  //     this.setState({ products: updatedProducts });
  //   };

  //   handleUpdate = async () => {
  //     const updatedProduct = this.state.products[this.state.editedProduct.index];
  //     try {
  //       await axios.put(`http://localhost:8080/product/updateProduct/${updatedProduct.id}`, updatedProduct);
  //       this.setState({ editedProduct: null });
  //       console.log('Product updated successfully');
  //     } catch (error) {
  //       console.error('Error updating product:', error);
  //     }
  //   };

  //   render() {
  //     return (
  //       <div className="product-list">
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Image</th>
  //               <th>Category</th>
  //               <th>SubCategory</th>
  //               <th>Brand</th>
  //               <th>Price</th>
  //               <th>Quantity</th>
  //               <th>SKU Code</th>
  //               <th>Manufacturer</th>
  //               <th>Description</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {this.state.products.map((product, index) => (
  //               <tr key={index}>
  //                 <td><img src={product.productImages[0].dataURL} alt={product.productName} /></td>
  //                 <td><input type="text" value={product.categoryName} name="categoryName" onChange={this.handleInputChange} /></td>
  //                 <td><input type="text" value={product.subCategoryName} name="subCategoryName" onChange={this.handleInputChange} /></td>
  //                 <td><input type="text" value={product.brandName} name="brandName" onChange={this.handleInputChange} /></td>
  //                 <td><input type="number" value={product.productPrice} name="productPrice" onChange={this.handleInputChange} /></td>
  //                 <td><input type="number" value={product.productQuantity} name="productQuantity" onChange={this.handleInputChange} /></td>
  //                 <td><input type="text" value={product.skuCode} name="skuCode" onChange={this.handleInputChange} /></td>
  //                 <td><input type="text" value={product.manufacturer} name="manufacturer" onChange={this.handleInputChange} /></td>
  //                 <td><input type="text" value={product.productDescription} name="productDescription" onChange={this.handleInputChange} /></td>
  //                 <td>
  //                   {this.state.editedProduct && this.state.editedProduct.index === index && (
  //                     <button onClick={this.handleUpdate}>Update</button>
  //                   )}
  //                   {!this.state.editedProduct && <button onClick={() => this.handleEdit(index, 'categoryName')}>Edit</button>}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     );
  //   }
  // }

  // export default ProductList;
