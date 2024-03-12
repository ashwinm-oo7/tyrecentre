package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.CarBrands;

@Repository
public interface CarBrandsRepo extends MongoRepository<CarBrands, String>{
	
}
