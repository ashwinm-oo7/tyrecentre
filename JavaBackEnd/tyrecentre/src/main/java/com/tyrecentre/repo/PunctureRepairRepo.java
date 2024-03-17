package com.tyrecentre.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.tyrecentre.entity.PunctureRepairEntity;

@Repository
public interface PunctureRepairRepo extends MongoRepository<PunctureRepairEntity, String>{

	@Query("{'mobileNumber' :?0} ")
	List<PunctureRepairEntity> findByMobile(Long mobileNumber);
}
