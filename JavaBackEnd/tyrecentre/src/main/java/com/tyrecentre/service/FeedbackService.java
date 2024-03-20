package com.tyrecentre.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.FeedbackEntity;
import com.tyrecentre.repo.FeedbackRepo;

@Service
public class FeedbackService {

	
	@Autowired
    private FeedbackRepo feedbackRepo;
	
	
	public FeedbackEntity addFeedback(@NonNull FeedbackEntity entity) {
    	try {
    		System.out.println(feedbackRepo.save(entity));
    		return feedbackRepo.save(entity);
    		
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during signup: " + e.getMessage());
    		return null;
    	}
    }


	public List<FeedbackEntity> getAllFeedback() {
		// TODO Auto-generated method stub
        return feedbackRepo.findAll();
	}
}
