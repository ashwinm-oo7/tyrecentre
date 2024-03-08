package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.Product;

@Repository
public interface ProductRepo extends MongoRepository<Product, String>{
	
}
