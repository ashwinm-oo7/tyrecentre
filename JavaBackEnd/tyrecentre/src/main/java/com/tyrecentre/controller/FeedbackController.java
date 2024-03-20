package com.tyrecentre.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tyrecentre.entity.Category;
import com.tyrecentre.entity.FeedbackEntity;
import com.tyrecentre.service.FeedbackService;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
	
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/addFeedback")
    public ResponseEntity<?> addFeedback(@RequestBody @NonNull FeedbackEntity entity) {
    	try {
    		FeedbackEntity feedback = feedbackService.addFeedback(entity);
    		return new ResponseEntity<>(feedback, HttpStatus.CREATED);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return new ResponseEntity<>("Failed to save data. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	//TODO service call
    }
    
    @GetMapping("/getAllFeedback")
    public ResponseEntity<List<FeedbackEntity>> getAllFeedback() {
        List<FeedbackEntity> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
	
}
