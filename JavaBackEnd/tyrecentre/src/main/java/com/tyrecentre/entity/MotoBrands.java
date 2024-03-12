package com.tyrecentre.entity;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "moto_brands") 
public class MotoBrands implements Serializable {

	List<ValueObjectDTO> data;
	String categoryName;

	public List<ValueObjectDTO> getData() {
		return data;
	}

	public void setData(List<ValueObjectDTO> data) {
		this.data = data;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	
}