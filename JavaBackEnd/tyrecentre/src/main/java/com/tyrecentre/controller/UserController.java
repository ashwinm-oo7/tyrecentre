package com.tyrecentre.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tyrecentre.entity.Customer;
import com.tyrecentre.repo.CustomerRepo;
import com.tyrecentre.utility.EncryptionDecryption;

@RestController
@RequestMapping("/user")
class UserController {

    @Autowired
    private CustomerRepo customerRepo;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @NonNull Customer entity) {
        System.out.println("API Called from REACT JS");

        try {
        	System.out.println(entity.getPassword());
        	String encPwd = EncryptionDecryption.encrypt(entity.getPassword());
        	System.out.println(encPwd);
        	entity.setPassword(encPwd);
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
            
            String decPwd = EncryptionDecryption.decrypt(existingCustomer.getPassword());
            System.out.println(decPwd);
            System.out.println(existingCustomer.getPassword());
            // Check if customer exists and password matches
            if (existingCustomer != null && decPwd.equals(entity.getPassword())) {
                // Login successful`
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
