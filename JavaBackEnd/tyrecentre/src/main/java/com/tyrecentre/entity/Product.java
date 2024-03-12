package com.tyrecentre.entity;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;


@Document(collection = "product") 
public class Product implements Serializable {

	/**
	 * 
	 */


	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	private String categoryName; // Name of the category

	private String subCategoryName; // Name of the subcategory

	private String brandName;
	private String productName;
	private Double productPrice;
	private Integer productQuantity;
	private String skuCode;
	private String manufacturer;
	private String productDescription;
	private String tyreNumber;
	private String tyreSize;
	public String getTyreSize() {
		return tyreSize;
	}

	public void setTyreSize(String tyreSize) {
		this.tyreSize = tyreSize;
	}

	private String specifications;

	private List<ProductImages> productImages;
	private List<ValueObjectDTO> vehicleBrandModels;


	public String getTyreNumber() {
		return tyreNumber;
	}

	public void setTyreNumber(String tyreNumber) {
		this.tyreNumber = tyreNumber;
	}

	public String getSpecifications() {
		return specifications;
	}

	public void setSpecifications(String specifications) {
		this.specifications = specifications;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@CreatedDate
	private Date createdDate;

	@Temporal(TemporalType.TIMESTAMP)
	@LastModifiedDate


	private Date lastModifiedDate;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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


	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Double getProductPrice() {
		return productPrice;
	}

	public void setProductPrice(Double productPrice) {
		this.productPrice = productPrice;
	}

	public Integer getProductQuantity() {
		return productQuantity;
	}

	public void setProductQuantity(Integer productQuantity) {
		this.productQuantity = productQuantity;
	}

	public String getSkuCode() {
		return skuCode;
	}

	public void setSkuCode(String skuCode) {
		this.skuCode = skuCode;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public String getProductDescription() {
		return productDescription;
	}

	public void setProductDescription(String productDescription) {
		this.productDescription = productDescription;
	} 

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getLastModifiedDate() {
		return lastModifiedDate;
	}

	public void setLastModifiedDate(Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}

	public List<ProductImages> getProductImages() {
		return productImages;
	}

	public void setProductImages(List<ProductImages> productImages) {
		this.productImages = productImages;
	}

	public List<ValueObjectDTO> getVehicleBrandModels() {
		return vehicleBrandModels;
	}

	public void setVehicleBrandModels(List<ValueObjectDTO> vehicleBrandModels) {
		this.vehicleBrandModels = vehicleBrandModels;
	}




}