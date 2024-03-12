// AddProduct.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import '../css/ProductImage.css';
import { FaTimes } from 'react-icons/fa'; // Import pencil icon from react-icons library
import Multiselect from 'multiselect-react-dropdown';


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

class AddProduct extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      subCategoryOptions: [],
      selectedCategory: '',
      selectedSubCategory: '',
      tyreCompanyOptions: [],
      selectedBrand: '',
      productImages: [],
      productName: '',
      productPrice: 0,
      productQuantity:0,
      skuCode: '',
      manufacturer: '',	
      productDescription: '',
      activeTab: 'general', // Add state for active tab
      productIdToUpdate:null,
      defaultDisabled: false,
      options: [],
      categoryForDropdownSearch: '',
      disabled: false,
      vehicleBrandModels: [],
      tyreSize: ''
    };
    this.state.productIdToUpdate = ''; // logic to get data from URL
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    this.state.productIdToUpdate = params.get('id');
    console.log('ID FROM URL : ' , this.state.productIdToUpdate );
    if(this.state.productIdToUpdate){
      this.fetchProductByProductId(this.state.productIdToUpdate);
    }
  }
  
  fetchProductByProductId= async (productIdToUpdate) =>  {
      const response = await fetch(`http://localhost:8080/product/getProductById/${productIdToUpdate}`, {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 
        const productData = await response.json();
        console.log('productData : ' , productData);
        if (productData.categoryName === "Two Wheeler") {
          console.log(' calling consructoer two wheeler');
          await this.fetchMotoBrandModels(productData.categoryName);
        } 
         if (productData.categoryName === 'Four Wheeler') {
          await this.fetchCarBrandModels(productData.categoryName);
        }
        setTimeout(() => {
          this.setState({
              defaultDisabled: true,
              selectedCategory: productData.categoryName,
              selectedSubCategory: productData.subCategoryName,
              selectedBrand:productData.brandName,
              productName: productData.productName,
              productPrice: productData.productPrice,
              productQuantity: productData.productQuantity,
              skuCode: productData.skuCode,
              manufacturer: productData.manufacturer,
              productDescription: productData.productDescription,
              productImages: productData.productImages,
              selectedValue: productData.vehicleBrandModels,
              tyreSize: productData.tyreSize
              
          });
          if(productData.categoryName){
            this.fetchSubCategoryOptions(productData.categoryName);
          }
          if(productData.subCategoryName){
            this.fetchTyreCompanyOptions(productData.subCategoryName);
          }
        }, 100);
  }
  
  componentDidMount() {
    this.fetchCategoryOptions();    
  }

  fetchCategoryOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/allCategory');
      console.log('Category Response:', response);
      const categoryOptions = response.data.map(category => category.categoryName);

      console.log('Category Options:', categoryOptions);
      this.setState({ categoryOptions });
    } catch (error) {
      console.error('Error fetching category options:', error);
    }
  };
  

  fetchSubCategoryOptions = async (selectedCategory) => {
    try {
        const response = await fetch(`http://localhost:8080/subcategory/getSubcategoriesByCategoryName/${selectedCategory}`, {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });    
        const subcategoryData = await response.json();
        console.log('SubCategory Response:', subcategoryData);
        
        
        const subCategoryOptions = subcategoryData.map(subcategory => subcategory.subCategoryName);
        console.log('SubCategory Options:', subCategoryOptions);

      this.setState({ subCategoryOptions });
    } catch (error) {
      console.error('Error fetching subcategory options:', error);
    }
  };
  
  fetchMotoBrandModels= async () =>{
    try {
      const response = await axios.get('http://localhost:8080/motoBrandModels/getMotoBrandModels');
      const brandModels = await response;
      console.log('MOTO brandModels Response:', brandModels.data);
      this.setState({ options:  brandModels.data});
      this.setState({ categoryForDropdownSearch:  brandModels.data[0].categoryName});
      console.log('MOTO categoryForDropdownSearch:', brandModels.data[0].categoryName);

    } catch (error) {
      console.error('Error fetching category options:', error);
    }
  }

  fetchCarBrandModels= async () =>{
    try {
      const response = await axios.get('http://localhost:8080/carBrandModels/getCarBrandModels');
      const brandModels = await response;
      console.log('car brandModels Response:', brandModels.data);
      this.setState({ options:  brandModels.data});
      this.setState({ categoryForDropdownSearch:  brandModels.data[0].categoryName});
      console.log('CAR categoryForDropdownSearch:', brandModels.data[0].categoryName);

    } catch (error) {
      console.error('Error fetching category options:', error);
    }
  }
 
  handleCategoryChange = async (e) => {
      const selectedCategory = e.target.value;

    // await this.fetchMotoBrandModels();

    // await this.fetchCarBrandModels();

    if (selectedCategory === "Two Wheeler") {
      await this.fetchMotoBrandModels(selectedCategory);
    } 
     if (selectedCategory === 'Four Wheeler') {
      await this.fetchCarBrandModels(selectedCategory);
    }
  

    setTimeout(() => {
      console.log('Category Selected:', selectedCategory);
      console.log('Category drop : ', this.state.categoryForDropdownSearch);
      if(selectedCategory !== this.state.categoryForDropdownSearch){
        this.setState({ options:  []});
      }
    }, 100);
    
    await this.setState({ selectedCategory });

     this.fetchSubCategoryOptions(selectedCategory); 

 };
// *************************GET TYRE Company*********************************************************************
fetchTyreCompanyOptions = async (selectedSubCategory) => {
    try {
        const response = await fetch(`http://localhost:8080/brand/getTyreCompanyBySubcategoryName/${selectedSubCategory}`, {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });    
        const tyreCompanyData = await response.json();
        console.log('SubCategory Response:', tyreCompanyData);
        
        
        const tyreCompanyOptions = tyreCompanyData.map(tyreCompanydata => tyreCompanydata.tyreCompanyName);
        console.log('tyreCompanyName Options:', tyreCompanyOptions);

      this.setState({ tyreCompanyOptions });
    } catch (error) {
      console.error('Error fetching subcategory options:', error);
    }
  };

  handleSubCategoryChange = async (e) => {
    const selectedSubCategory = e.target.value;

  await this.setState({ selectedSubCategory });

   this.fetchTyreCompanyOptions(selectedSubCategory); 
  // Pass the selected Subcategory to fetch subcategories
};

// ********************************************************************************************
uploadBase64Image = (base64String, filename) => {
    
  const element = document.createElement('a');
  element.setAttribute('href', base64String);
  element.setAttribute('upload', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

uploadAllImages = () => {
  // Iterate through all images and upload them
  this.state.images.forEach((image, index) => {
    this.uploadBase64Image(image.dataURL, `Image_${index + 1}.png`);
  });
};

  handleAddProduct = async () => {
    const { selectedCategory, selectedSubCategory, selectedBrand,productName,productPrice,productQuantity
    ,skuCode,manufacturer,productDescription,productImages} = this.state;
    try {
        if (!this.state.selectedCategory  || this.state.selectedCategory.length === 0) {
          console.log('category',this.state.categoryName);
          toast.warning('Please select Categoty !');
          return;
        }
        if (!this.state.selectedSubCategory  || this.state.selectedSubCategory.length === 0) {
          toast.warning('Please select SubCategoty !');
          return;
        }
        if (!this.state.selectedBrand  || this.state.selectedBrand.length === 0) {
          toast.warning('Please select Brand !');
          return;
        }
        if (!productImages || productImages.length === 0) {
            // Display error message when there are no product images
            toast.warning('Please upload product images');
            return; // Exit the function early if there are no images
        }
        

      const response = await axios.post('http://localhost:8080/product/add', {
        categoryName: selectedCategory,
        subCategoryName: selectedSubCategory,
        brandName:selectedBrand,
        productName: productName,
        productPrice: productPrice,
        productQuantity: productQuantity,
        skuCode: skuCode,
        manufacturer: manufacturer,
        productDescription:productDescription,
        productImages: this.state.productImages,
        id: this.state.productIdToUpdate,
        vehicleBrandModels: this.state.vehicleBrandModels,
        tyreSize: this.state.tyreSize
      });

      this.setState({
        selectedCategory: '',
        selectedSubCategory: '',
        selectedBrand: '',
        productName: '',
        brandName:'',
        productPrice: 0,
        productQuantity: 0,
        skuCode: '',
        manufacturer: '',
        productDescription:'',
        productImages: [],

      });

      if (response.status === 200) {
        toast.success('Product added successfully', { autoClose: 2000 } );
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    }
    window.location.reload();
  };

  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
  };



  handleImageUpload = async (e,images) => {
    const files = e.target.files;
    const reader = new FileReader();

    if (files.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    if (this.state.productImages.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }
  

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if file size is less than 5MB
      if (file.size <= 5 * 1024 * 1024) {
        // Convert file to base64 string
        try {
          const base64String = await fileToBase64(file);
          // Push image data to productImages array
          this.state.productImages.push({
            dataURL: base64String,
            fileName: file.name,
            type: file.type,
            size: Math.round(file.size / 1024),
            description: 'Description for image ' + (i + 1),
            productId: ''
          });
          console.log('state after image selected : ', this.state);
        } catch (error) {
          console.error('Error converting file to base64:', error);
          return;
        }
      } else {
        alert('Image size exceeds 5MB limit');
        return;
      }
      reader.readAsDataURL(file);

    }

    // Update state with uploaded images
    this.setState({

      images: this.productImages,
      imageIndex: null, // Reset the image index when new images are uploaded
      
    });
  };


  handleDeleteImage = (index) => {
    // Make a copy of the productImages array
    const updatedImages = [...this.state.productImages];
    // Remove the image at the specified index
    updatedImages.splice(index, 1);
    // Update the state with the modified array
    this.setState({ productImages: updatedImages });
  };
  onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    this.setState({ vehicleBrandModels: selectedList});
}



  onRemove(selectedList, removedItem) {
    this.setState({ vehicleBrandModels: selectedList});
    console.log('remove : ', selectedList);
  }

  render() {
    const isProductNameEmpty = this.state.productName.trim() === '';
    
    
    return (
        <div className="add-product-container">
        <div className="tab-buttons">
          <button className={this.state.activeTab === 'ProductImage' ? 'active' : ''} onClick={() => this.handleTabChange('ProductImage')}>ProductImage</button>
          <button className={this.state.activeTab === 'general' ? 'active' : ''} onClick={() => this.handleTabChange('general')}>Add Product</button>
        </div>
        <div className="tab-content">
        
        {this.state.activeTab === 'general' && (
          <div>
            <label>
              Category:
              <select id='categorySelectId'
                value={this.state.selectedCategory}
                onChange={this.handleCategoryChange}
                disabled={this.state.defaultDisabled ? true : null}
              >
                <option value="">Select a category</option>
                {this.state.categoryOptions.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subcategory:
              <select id='subCategorySelectId'
                value={this.state.selectedSubCategory}
                onChange={this.handleSubCategoryChange}
                disabled={this.state.defaultDisabled ? true : null}
              >
                <option value="">Select a subcategory</option>
                {this.state.subCategoryOptions.map((subcategoryName) => (
                  <option key={subcategoryName} value={subcategoryName}>
                    {subcategoryName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tyre Company:
              <select id='brandSelectId'
                value={this.state.selectedBrand}
                disabled={this.state.defaultDisabled ? true : null}
                onChange={(e) => this.setState({ selectedBrand: e.target.value })}
              >
                <option value="">Select a Brand</option>
                {this.state.tyreCompanyOptions.map((tyreCompanyName) => (
                  <option key={tyreCompanyName} value={tyreCompanyName}>
                    {tyreCompanyName}
                  </option>
                ))}
              </select>
            </label>

            <label>
          Product Name<span style={{ color: 'red' }}>*</span>:
          <input
            type="text"
            value={this.state.productName}
            onChange={(e) => this.setState({ productName: e.target.value })}
            placeholder="Enter Product Name"
            required
          />
        </label>
        <label>
          Tyre Size<span style={{ color: 'red' }}>*</span>:
          <input
            type="text"
            value={this.state.tyreSize}
            onChange={(e) => this.setState({ tyreSize: e.target.value })}
            placeholder="Enter Tyre Size"
            required
          />
        </label>
        <label>
              Vehicles :
              <Multiselect
                options={this.state.options} // Options to display in the dropdown
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={this.onSelect} // Function will trigger on select event
                onRemove={this.onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
                disable={this.state.disabled}
                selectionLimit={10} // Set the selection limit to 3

                />
            </label>
        <label>
          Product Price<span style={{ color: 'red' }}>*</span>:
          <input
            type="number"
            value={this.state.productPrice}
            onChange={(e) => this.setState({ productPrice: e.target.value })}
            placeholder="Enter product price"
            required
          />
        </label>
        <label>
          Product Qty<span style={{ color: 'red' }}>*</span>:
          <input
            type="number"
            value={this.state.productQuantity}
            onChange={(e) => this.setState({ productQuantity: e.target.value })}
            placeholder="Enter product quantity"
            required
          />
        </label>
        <label>
          SKU Code<span style={{ color: 'red' }}>*</span>:
          <input
            type="text"
            value={this.state.skuCode}
            onChange={(e) => this.setState({ skuCode: e.target.value })}
            placeholder="Enter product quantity"
            required
          />
        </label>
        <label>
          Manufacturer<span style={{ color: 'red' }}>*</span>:
          <input
            type="text"
            value={this.state.manufacturer}
            onChange={(e) => this.setState({ manufacturer: e.target.value })}
            placeholder="Enter product quantity"
            required
          />
        </label>
        

        <label>
        Product Description:
          <textarea
            value={this.state.productDescription}
            onChange={(e) => this.setState({ productDescription: e.target.value })}
            placeholder="Enter product description"
          />
        </label>
        <label>
          <div>
        {/* Input field for image upload */}
        <div>
        Upload Images:
        <input type="file" multiple onChangeCapture={this.handleImageUpload} />
        </div>
        {/* Display uploaded images */}
        <div className="image-preview">
          {this.state.productImages.map((image, index) => (
            <div className="image-preview-item" key={index}>
            <img src={image.dataURL} alt={`Product Imagee ${index + 1}`} />

              <p >Names: {image.fileName}</p>

              <p >Description: {image.description}</p>
              
              <p >Size: {image.size} KB</p>
              
              {/* <p > Type: {image.type}</p> */}

              <FaTimes className="delete-icon" onClick={() => this.handleDeleteImage(index)} />


            </div>
            
          ))}
          
        </div>

      </div>
        </label>

        <button onClick={this.handleAddProduct} disabled={isProductNameEmpty}>
          { this.state.productIdToUpdate ? 'Update' : 'Add Product'}
        </button>

        <Link to="/categories">Back</Link>
          </div>
        )}

        {/* {this.state.activeTab === 'ProductImage' && (
            <div>
              <ProductImage />

            </div>
          )} */}

        </div>


      </div>
    );
  }
}

export default AddProduct;