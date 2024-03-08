package com.tyrecentre.repo;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.Brand;

@Repository
public interface BrandRepo extends MongoRepository<Brand, String>{
	
	
//    @Query("{'categoryName' :?0 , 'subCategoryName' :?1 ,'tyreCompanyName' :?2   ")
//	List<Brand> findByCategoryNameAndSubCategoryName(String categoryName, String subCategoryName,
//			String tyreCompanyName );

    @Query("{'subCategoryName' :?0} ")
	List<Brand> getTyreCompanyBySubcategoryName(String subCategoryName);


}
