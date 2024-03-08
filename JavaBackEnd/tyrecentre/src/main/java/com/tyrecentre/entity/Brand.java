package com.tyrecentre.entity;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "brand") 
public class Brand implements Serializable {

    @Id
    private String id;

    private String categoryName; // Name of the category
    
    private String subCategoryName; // Name of the subcategory
    private String subCategoryDescription;
    
    private String tyreCompanyName; // Name of the subcategory
    private String tyreCompanyDescription;
    

	public String getId() {
		// TODO Auto-generated method stub
		return id;
	}

	public String getCategoryName() {
		return categoryName; 
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}    
    
	public String getSubCategoryName() {
		return subCategoryName;
	}
	public void setSubCategoryName(String subCategoryName) {
		this.subCategoryName = subCategoryName;
	}
	public String getTyreCompanyName() {
		// TODO Auto-generated method stub
		return tyreCompanyName;
	}
	
	public void setTyreCompanyName(String tyreCompanyName) {
		this.tyreCompanyName = tyreCompanyName;
	}
	
	public String getTyreCompanyDescription() {
		// TODO Auto-generated method stub
		return tyreCompanyDescription;
	}
	
	public void setTyreCompanyDescription(String tyreCompanyDescription) {
		this.tyreCompanyDescription = tyreCompanyDescription;
	}
	
}