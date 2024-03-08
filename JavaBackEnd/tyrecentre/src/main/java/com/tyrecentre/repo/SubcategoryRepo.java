package com.tyrecentre.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.Subcategory;

@Repository
public interface SubcategoryRepo extends MongoRepository<Subcategory, String> {

	@Query("{'categoryName' :?0 , 'subCategoryName' :?1}")
	List<Subcategory> getBySubcategoryName(String categoryName , String subCategoryName);

	@Query("{'categoryName' :?0}")
	List<Subcategory> getSubcategoriesByCategoryName(String categoryName);
}
