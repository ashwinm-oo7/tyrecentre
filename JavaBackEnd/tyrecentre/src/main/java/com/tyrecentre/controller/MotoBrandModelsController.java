package com.tyrecentre.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tyrecentre.entity.ValueObjectDTO;
import com.tyrecentre.service.MotoBrandModelService;

@RestController
@RequestMapping("/motoBrandModels")
class MotoBrandModelsController {
	
	@Autowired
	MotoBrandModelService brandModelService;
	
	@GetMapping("/getMotoBrandModels")
	public List<ValueObjectDTO> getMotoBrandModels() {

		return brandModelService.getMotoBrandModels();
	}
    
}
