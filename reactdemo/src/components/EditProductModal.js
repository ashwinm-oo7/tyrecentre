import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProductModal = ({ productId, onSave, onClose }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch selected product details
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform update operation here
    // Example: 
    // await axios.put(`http://localhost:8080/product/${productId}`, product);
    onSave(product);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} />
          {/* Render other form fields similarly */}
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
