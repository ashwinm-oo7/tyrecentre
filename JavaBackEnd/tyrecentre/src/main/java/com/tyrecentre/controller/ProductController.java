package com.tyrecentre.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.lang.NonNull;
import com.tyrecentre.entity.Product;
import com.tyrecentre.service.ProductService;

@RestController
@RequestMapping("/product")
class ProductController {
	
    @Autowired
    private ProductService productService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody @NonNull Product entity) {
        try {
            ResponseEntity<?> response  = productService.addOrUpdateTyreCompany(entity);
            return response;
        } catch (Exception e) {
            System.err.println("Error during Product creation: " + e.getMessage());
            return new ResponseEntity<>("Error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
