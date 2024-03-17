package com.tyrecentre.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.PunctureRepairEntity;
import com.tyrecentre.repo.PunctureRepairRepo;

@Service
public class PunctureRepairService {

	@Autowired
	PunctureRepairRepo punctureRepairRepo;
	
	public ResponseEntity<?> addOrUpdatePunctureRepair(PunctureRepairEntity entity) {
		// TODO Auto-generated method stub
		try {
			entity.setTotalAmount(0.00);
        return new ResponseEntity<>(punctureRepairRepo.save(entity), HttpStatus.CREATED);
    	} catch (Exception e) {
    		// Log the exception for debugging purposes
    		System.err.println("Error during Add: " + e.getMessage());
    		return null;
    	}
	}
	
    public ResponseEntity<?> updateRepairStatus(String id, String status) {
        try {
            // Find the puncture repair entity by ID
            Optional<PunctureRepairEntity> optionalRepair = punctureRepairRepo.findById(id);
            if (!optionalRepair.isPresent()) {
                return new ResponseEntity<>("Puncture repair entity not found", HttpStatus.NOT_FOUND);
            }
            
            // Update the status
            optionalRepair.get().setUpdatedDateTime(LocalDateTime.now(ZoneOffset.UTC));
            optionalRepair.get().setStatus(status);
            
            // Save the updated entity
            if(optionalRepair.isPresent()) {
            	punctureRepairRepo.save(optionalRepair.get());
            }
            
            return new ResponseEntity<>("Status updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error during puncture repair status update: " + e.getMessage());
            return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    public ResponseEntity<?> updateAmout(String id, Double amt) {
        try {
            // Find the puncture repair entity by ID
            Optional<PunctureRepairEntity> optionalRepair = punctureRepairRepo.findById(id);
            if (!optionalRepair.isPresent()) {
                return new ResponseEntity<>("Puncture repair entity not found", HttpStatus.NOT_FOUND);
            }
            
            // Update the status
            optionalRepair.get().setUpdatedDateTime(LocalDateTime.now(ZoneOffset.UTC));
            optionalRepair.get().setTotalAmount(amt);
            
            // Save the updated entity
            if(optionalRepair.isPresent()) {
            	punctureRepairRepo.save(optionalRepair.get());
            }
            
            return new ResponseEntity<>("Amout updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error during puncture repair status update: " + e.getMessage());
            return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


	public List<PunctureRepairEntity> getPunctureRepairList() {
        return punctureRepairRepo.findAll();
		
	}

	public List<PunctureRepairEntity> getPunctureRepairByMobileList(Long mobile) {
		return punctureRepairRepo.findByMobile(mobile);
	}


}
