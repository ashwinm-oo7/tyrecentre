package com.tyrecentre.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Category;
import com.tyrecentre.entity.Subcategory;
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
	
	public List<Category> allCategory() {
		return categoryRepo.findAll();
	}



	public ResponseEntity<?> addOrUpdateCategory(@NonNull Category updatedCategory) {
		
		try {
			if(updatedCategory.getId() == null) {
				categoryRepo.save(updatedCategory);
	            return new ResponseEntity<>("Category added successfully", HttpStatus.CREATED);
			}
            Optional<Category> CategoryOptional = categoryRepo.findById(updatedCategory.getId());
            if (!CategoryOptional.isPresent()) {
                return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
            }
            if(CategoryOptional.isPresent()) {
            	CategoryOptional.get().setCategoryName(updatedCategory.getCategoryName());
            	CategoryOptional.get().setCategoryDescription(updatedCategory.getCategoryDescription());
            	categoryRepo.save(CategoryOptional.get());
            	return new ResponseEntity<>("category updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Category not updated", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Error updating Category: " + e.getMessage());
            return new ResponseEntity<>("Failed to update Category. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
		 
	}
}
