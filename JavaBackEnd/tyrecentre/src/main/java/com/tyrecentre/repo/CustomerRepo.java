package com.tyrecentre.repo;
import com.tyrecentre.entity.Customer;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.tyrecentre.entity.Customer;

public interface CustomerRepo extends MongoRepository<Customer, String>{

	@Query("{email :?0}")
	Customer findByEmail(String email);


}
