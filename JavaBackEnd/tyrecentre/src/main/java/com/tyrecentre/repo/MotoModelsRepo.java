package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.MotoModels;

@Repository
public interface MotoModelsRepo extends MongoRepository<MotoModels, String>{
	
}
