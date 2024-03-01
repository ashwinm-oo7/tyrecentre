package com.tyrecentre.repo;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.tyrecentre.entity.Category;

public interface CategoryRepo extends MongoRepository<Category, String>{

}
