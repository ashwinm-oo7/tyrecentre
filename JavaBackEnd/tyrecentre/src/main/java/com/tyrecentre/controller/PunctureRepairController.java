package com.tyrecentre.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.lang.NonNull;
import com.tyrecentre.constant.Constant;
import com.tyrecentre.entity.PunctureRepairEntity;
import com.tyrecentre.service.PunctureRepairService;

@RestController
@RequestMapping("/punctureRepair")
public class PunctureRepairController {
	
    @Autowired
    private PunctureRepairService punctureRepairService;

    @PostMapping("/addPuncture")
    public ResponseEntity<?> addPuncture(@RequestBody @NonNull PunctureRepairEntity entity) {
    	try {
    		if(Objects.isNull(entity.getCreatedDateTime())) {
    			entity.setCreatedDateTime(LocalDateTime.now());
    		}
    		entity.setUpdatedDateTime(LocalDateTime.now());
    		ResponseEntity<?> response  = punctureRepairService.addOrUpdatePunctureRepair(entity);
    		return response;
    	} catch (Exception e) {
    		System.err.println("Error during PunctureRepair creation: " + e.getMessage());
    		return new ResponseEntity<>("Error",HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
    
    @GetMapping("/getPunctureRepairList")
    public List<PunctureRepairEntity> getPunctureRepairList() {
    	List<PunctureRepairEntity> punctureRepairEntity = punctureRepairService.getPunctureRepairList();
        return  punctureRepairEntity;
    }
    
    @GetMapping("/getPunctureRepairByMobileList/{mobile}")
    public List<PunctureRepairEntity> getPunctureRepairByMobileList(@PathVariable Long mobile) {
    	List<PunctureRepairEntity> punctureRepairEntity = punctureRepairService.getPunctureRepairByMobileList(mobile);
        return punctureRepairEntity;
    }
    
    @GetMapping("/getAllStatusStr")
    public List<String> getAllStatusStr() {
			return Constant.getAllStatusStr();
    }
    
    @PutMapping("/updateRepairStatus/{id}/{status}")
    public ResponseEntity<?> updateRepairStatus(@PathVariable String id, @PathVariable String status) {
        try {
            punctureRepairService.updateRepairStatus(id, status);
            return ResponseEntity.ok("Repair status updated successfully");
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating repair status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/updateAmout/{id}/{amt}")
    public ResponseEntity<?> updateAmout(@PathVariable String id, @PathVariable String amt) {
        try {
            punctureRepairService.updateAmout(id, Double.valueOf(amt));
            return ResponseEntity.ok("Repair status updated successfully");
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating repair status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
}
