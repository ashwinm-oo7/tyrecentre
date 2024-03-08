package com.tyrecentre.controller;


import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.lang.NonNull;
import com.tyrecentre.entity.Subcategory;
import com.tyrecentre.repo.SubcategoryRepo;
import com.tyrecentre.service.SubcategoryService;



@RestController
@RequestMapping("/subcategory")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;
    
    @Autowired
	SubcategoryRepo repo;

    @PostMapping("/add")
    public ResponseEntity<?> addSubcategory(@RequestBody @NonNull Subcategory entity) {
        try {
        	List<Subcategory> list = repo.getBySubcategoryName(entity.getCategoryName(), entity.getSubCategoryName());
        	boolean exists = !list.stream().filter(l -> 
        			l.getCategoryName().equalsIgnoreCase(entity.getCategoryName())
        			&& l.getSubCategoryName().equalsIgnoreCase(entity.getSubCategoryName())).findFirst().isEmpty();
            if(exists) {
            	return new ResponseEntity<>("Duplicate Subcategory Name Not Allowed !",HttpStatus.NOT_ACCEPTABLE);
            }
            ResponseEntity<?> response  = subcategoryService.addOrUpdateSubcategory(entity);
            return response;
        } catch (Exception e) {
            System.err.println("Error during subcategory creation: " + e.getMessage());
            return new ResponseEntity<>("Error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to update an existing subcategory
//    @PutMapping("/update")
//    public ResponseEntity<Subcategory> updateSubcategory(@RequestBody @NonNull Subcategory entity) {
//        try {
//            Subcategory subcategory = subcategoryService.updateSubcategory(entity);
//            return new ResponseEntity<>(subcategory, HttpStatus.OK);
//        } catch (Exception e) {
//            System.err.println("Error during subcategory update: " + e.getMessage());
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    
    @GetMapping("/allSubCategory")
    public ResponseEntity<List<Subcategory>> allSubCategory() {
       
    	List<Subcategory> subbcategories = repo.findAll();
    	
        return new ResponseEntity<>(subbcategories, HttpStatus.OK);
    }
    
    @GetMapping("/getSubcategoriesByCategoryName/{categoryName}")
    public List<Subcategory> getSubcategoriesByCategoryName(@PathVariable String categoryName) {
    	List<Subcategory> subcategory = repo.getSubcategoriesByCategoryName(categoryName);
        if (Objects.isNull(subcategory)) {
            return null;
        }
        return subcategory;
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubcategory(@PathVariable @org.springframework.lang.NonNull String id) {
        try {
            // Check if subcategory exists
            Optional<Subcategory> subcategoryOptional = repo.findById(id);
            if (subcategoryOptional == null ||subcategoryOptional.isEmpty()) {
                return new ResponseEntity<>("Subcategory not found", HttpStatus.NOT_FOUND);
            }
            repo.deleteById(id);
            return new ResponseEntity<>("Subcategory deleted successfully", HttpStatus.OK);

        	
//            subcategoryService.deleteSubcategory(subcategoryId);
//            return new ResponseEntity<>("Subcategory deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception for debugging purposes
            System.err.println("Error deleting subcategory: " + e.getMessage());
            return new ResponseEntity<>("Failed to delete subcategory. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateSubcategory(@RequestBody @NonNull Subcategory updatedSubcategory) {
        	ResponseEntity<?> response = subcategoryService.addOrUpdateSubcategory(updatedSubcategory);
            return response;
    }
}
