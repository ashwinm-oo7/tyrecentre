import React, { Component } from 'react';

class Subcategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      subcategoryOptions: [],
      newOption: '',
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleAddSubcategory = this.handleAddSubcategory.bind(this);
  }

  async componentDidMount() {
    // Fetch subcategory options based on the category name
    const { categoryName } = this.props;
    try {
      const response = await fetch(`http://localhost:8080/getSubcategoryOptions?categoryName=${categoryName}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ subcategoryOptions: data });
      } else {
        console.error('Failed to fetch subcategory options');
      }
    } catch (error) {
      console.error('Error fetching subcategory options:', error);
    }
  }

  handleOptionChange(event) {
    this.setState({ selectedOption: event.target.value });
  }

  handleAddOption(event) {
    this.setState({ newOption: event.target.value });
  }

  async handleAddSubcategory() {
    // Handle adding subcategory based on the selected option
    const { selectedOption, newOption } = this.state;
    const { categoryName } = this.props;
    
    let url = '';
    if (selectedOption === 'Add an option') {
      // Add the new option
      url = `http://localhost:8080/addSubcategory?categoryName=${categoryName}&subcategory=${newOption}`;
    } else {
      // Use the selected option
      url = `http://localhost:8080/addSubcategory?categoryName=${categoryName}&subcategory=${selectedOption}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log('Subcategory added successfully');
        // Clear the selected option
        this.setState({ selectedOption: '', newOption: '' });
      } else {
        console.error('Failed to add subcategory');
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  }

  render() {
    const { selectedOption, subcategoryOptions, newOption } = this.state;

    return (
      <div>
        <label>
          Subcategory Option:
          <select value={selectedOption} onChange={this.handleOptionChange}>
            <option value="">Select an option</option>

          </select>

          <select value={selectedOption} onChange={this.handleOptionChange}>
            <option value="">Vehicle company</option>
            <option value="TyreSize">TyreSize</option>
          </select>

          <select value={selectedOption} onChange={this.handleOptionChange}>
            <option value="">TyreSize</option>
            <option value="vsgcs">TyreSize</option>
          </select>

        </label>
        {selectedOption === 'Add an option' && (
          <div>
            <label>
              New Option:
              <input type="text" value={newOption} onChange={this.handleAddOption} />
            </label>
          </div>
        )}
        <button onClick={this.handleAddSubcategory}>Add Subcategory</button>
      </div>
    );
  }
}

export default Subcategories;
