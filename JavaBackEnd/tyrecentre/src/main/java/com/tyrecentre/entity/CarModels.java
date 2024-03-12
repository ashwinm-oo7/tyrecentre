package com.tyrecentre.entity;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "car_models") 
public class CarModels implements Serializable {

	List<ValueObjectDTO> data;

	public List<ValueObjectDTO> getData() {
		return data;
	}

	public void setData(List<ValueObjectDTO> data) {
		this.data = data;
	}
}