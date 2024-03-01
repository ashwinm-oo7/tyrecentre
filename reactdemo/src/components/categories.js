import React, { Component } from 'react';
import '../css/categories.css';
import Modal from 'react-modal';
import Subcategories from './subcategories';

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      categoryName: '',
      categoryDescription: '',
      subcategories: [],
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryDescriptionChange = this.handleCategoryDescriptionChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleAddSubcategory = this.handleAddSubcategory.bind(this);

  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleAddButtonClick() {
    this.setState({ isOpen: true });
  }

  handleCloseButtonClick() {
    this.setState({ isOpen: false });
  }

  handleCategoryNameChange(event) {
    this.setState({ categoryName: event.target.value });
  }

  handleCategoryDescriptionChange(event) {
    this.setState({ categoryDescription: event.target.value });

  }
  handleCloseButtonClick() {
    this.setState({ modalIsOpen: false });
  }

  

  handleAddCategory =async(e) => {
    // Perform validation if necessary
    // Add logic to add category
    // Reset state
    e.preventDefault();

    console.log(this.state);
    // this.setState({
    //   categoryName: '',
    //   categoryDescription: '',

    // });
    let data ={
        categoryName : this.state.categoryName,
        categoryDescription: this.state.categoryDescription
    }
    try {
        const response = await fetch('http://localhost:8080/category/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',

          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          console.log(response);
          console.log('Add successfully');          

          // Redirect or perform any other actions after successful registration
        } else {
          console.error('Failed to Add category');
        }
      } catch (error) {
        console.error('Error during user Category:', error);
      }
  }

  handleAddSubcategory(subcategoryData) {
    this.setState(prevState => ({
      subcategories: [...prevState.subcategories, subcategoryData]
    }));
  }



  render() {
    const customStyles = {
      content: {
        top: '50%',
        left: '25%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundcolor: 'darkblue' // Dark blue color for modal content
      },
    };
    const isCategoryNameEmpty = this.state.categoryName.trim() === '';

    return (
      <div>
        <button onClick={this.openModal} style={{ backgroundColor: 'lightblue' }}>Add Category</button>

        <Modal 
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div style={{ backgroundColor: 'lightblue' }}>
            <label>
            Category Name<span style={{ color: 'red' }}>*</span>:
              <input
                type="text"
                value={this.state.categoryName}
                onChange={this.handleCategoryNameChange}
                placeholder="Enter category name"
                required
              />
            </label>
            <div>
              <label>
                Category Description:
                <textarea
                  value={this.state.categoryDescription}
                  onChange={this.handleCategoryDescriptionChange}
                  placeholder="Enter category name*"

                />
              </label>
            </div>
            <button onClick={this.handleAddCategory} disabled={isCategoryNameEmpty} 
            style={{marginRight: '0.5cm', backgroundColor: 'red', color: 'white' }}>Add</button>

            <button onClick={this.handleCloseButtonClick} 
            style={{ backgroundColor: 'red', color: 'white' }}>Close</button>
          </div>
          <div>
          <Subcategories 
            initialCategoryName={this.state.categoryName} 
            initialCategoryDescription={this.state.categoryDescription}
            onAddSubcategory={this.handleAddSubcategory} 
          />
          </div>
        </Modal>
                {/* Display added subcategories */}
                {this.state.subcategories.map((subcategory, index) => (
          <div key={index}>
            <p>Category Name: {subcategory.categoryName}</p>
            <p>Description: {subcategory.categoryDescription}</p>
            <p>Selected Option: {subcategory.selectedOption}</p>
          </div>
        ))}

      </div>
    );
  }
}

export default Categories;
