package com.tyrecentre.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Subcategory;
import com.tyrecentre.repo.SubcategoryRepo;

@Service
public class SubcategoryService {
	
	@Autowired
	SubcategoryRepo repo;

	public ResponseEntity<?> addOrUpdateSubcategory(@NonNull Subcategory updatedSubcategory) {
		
		try {
			if(updatedSubcategory.getId() == null) {
				repo.save(updatedSubcategory);
	            return new ResponseEntity<>("Subcategory added successfully", HttpStatus.CREATED);
			}
            Optional<Subcategory> subcategoryOptional = repo.findById(updatedSubcategory.getId());
            if (!subcategoryOptional.isPresent()) {
                return new ResponseEntity<>("Subcategory not found", HttpStatus.NOT_FOUND);
            }
            if(subcategoryOptional.isPresent()) {
            	subcategoryOptional.get().setSubCategoryName(updatedSubcategory.getSubCategoryName());
            	subcategoryOptional.get().setSubCategoryDescription(updatedSubcategory.getSubCategoryDescription());
            	repo.save(subcategoryOptional.get());
            	return new ResponseEntity<>("Subcategory updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Subcategory not updated", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Error updating subcategory: " + e.getMessage());
            return new ResponseEntity<>("Failed to update subcategory. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
		 
	}
}
