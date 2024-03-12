package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.CarModels;

@Repository
public interface CarModelsRepo extends MongoRepository<CarModels, String>{
	
}

