package com.tyrecentre.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tyrecentre.entity.Category;
import com.tyrecentre.entity.Subcategory;
import com.tyrecentre.service.CategoryService;

@RestController
@RequestMapping("/category")
class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<?> addCategory(@RequestBody @NonNull Category entity) {
    	try {
    		Category category = categoryService.addCategory(entity);
    		return new ResponseEntity<>(category, HttpStatus.CREATED);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return new ResponseEntity<>("Failed to save data. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	//TODO service call
    }
    
    @PostMapping("/update")
    public ResponseEntity<?> updateCategory(@RequestBody @NonNull Category entity) {
    	try {
    		Category category = categoryService.updateCategory(entity);
    		return new ResponseEntity<>(category, HttpStatus.CREATED);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return new ResponseEntity<>("Failed to save data. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	//TODO service call
    }
    
    
    @GetMapping("/allCategory")
    public ResponseEntity<List<Category>> allCategory() {
       
    	List<Category> subcategories = categoryService.allCategory();
    	
        return new ResponseEntity<>(subcategories, HttpStatus.OK);
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateeCategory(@RequestBody @NonNull Category updatedCategory) {
        	ResponseEntity<?> response = categoryService.addOrUpdateCategory(updatedCategory);
            return response;
    }    
}
