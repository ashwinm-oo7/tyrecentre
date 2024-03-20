package com.tyrecentre.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tyrecentre.entity.FeedbackEntity;

public interface FeedbackRepo extends MongoRepository<FeedbackEntity, String>{



}
