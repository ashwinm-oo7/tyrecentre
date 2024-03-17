import React, { Component } from "react";
// import "../css/categories.css";
import { Link } from "react-router-dom";
class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      categoryName: "",
      categoryDescription: "",
      subcategories: [],
      modalIsOpen: false,
    };

    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryDescriptionChange =
      this.handleCategoryDescriptionChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
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

  handleAddCategory = async (e) => {
    e.preventDefault();
    console.log(this.state);
    let data = {
      categoryName: this.state.categoryName,
      categoryDescription: this.state.categoryDescription,
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "category/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log(response);
        console.log("Add successfully");
      } else {
        console.error("Failed to Add category");
      }
    } catch (error) {
      console.error("Error during user Category:", error);
    }
  };
  render() {
    const isCategoryNameEmpty = this.state.categoryName.trim() === "";

    return (
      <div>
        <div style={{ backgroundColor: "lightblue" }}>
          <label>
            Category Name<span style={{ color: "red" }}>*</span>:
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
          <button
            onClick={this.handleAddCategory}
            disabled={isCategoryNameEmpty}
            style={{
              marginRight: "0.5cm",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Add
          </button>
          <p className="next-subcategory">
            <Link to="/home">Home</Link>
          </p>
          <p className="next-subcategory">
            <Link to="/subcategories">Next</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Categories;
