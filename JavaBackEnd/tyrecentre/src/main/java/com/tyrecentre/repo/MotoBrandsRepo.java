package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.MotoBrands;

@Repository
public interface MotoBrandsRepo extends MongoRepository<MotoBrands, String>{
	
}
