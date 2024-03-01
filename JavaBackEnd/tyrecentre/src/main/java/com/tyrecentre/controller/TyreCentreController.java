package com.tyrecentre.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tyrecentre.entity.Customer;
import com.tyrecentre.repo.CustomerRepo;

@RestController
@RequestMapping("/tyrecentre")
class TyreCentreController {

    @Autowired
    private CustomerRepo customerRepo;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @NonNull Customer entity) {
        System.out.println("API Called from REACT JS");

        try {
            Customer savedCustomer = customerRepo.save(entity);
            return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the exception for debugging purposes
            System.err.println("Error during signup: " + e.getMessage());
            return new ResponseEntity<>("Failed to signup. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @NonNull Customer entity) {
        System.out.println("API Called from REACT JS");

        try {
            // Find customer by email
            Customer existingCustomer = customerRepo.findByEmail(entity.getEmail());

            // Check if customer exists and password matches
            if (existingCustomer != null && existingCustomer.getPassword().equals(entity.getPassword())) {
                // Login successful
                return new ResponseEntity<>(existingCustomer, HttpStatus.OK);
            } else {
                // Login failed due to invalid email or password
                return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            // Error occurred during login process
            return new ResponseEntity<>("Failed to login. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}
