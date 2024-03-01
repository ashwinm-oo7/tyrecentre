package com.tyrecentre.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Category;
import com.tyrecentre.repo.CategoryRepo;

@Service
public class CategoryService {
	
	@Autowired
    private CategoryRepo categoryRepo;
	
	
	public Category addCategory(Category entity) {
    	try {
    		return categoryRepo.save(entity);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return null;
    	}
    }


	public Category updateCategory(Category entity) {
		try {
    		return categoryRepo.save(entity);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return null;
    	}
	}

}
