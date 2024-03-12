package com.tyrecentre.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.CarBrands;
import com.tyrecentre.entity.CarModels;
import com.tyrecentre.entity.ValueObjectDTO;
import com.tyrecentre.repo.CarBrandsRepo;
import com.tyrecentre.repo.CarModelsRepo;

@Service
public class CarBrandModelService {
	
	@Autowired
	CarBrandsRepo brandsRepo;
	@Autowired
	CarModelsRepo modelsRepo;

		public List<ValueObjectDTO> getCarBrandModels() {
			
			List<ValueObjectDTO> dtos = new ArrayList<>();
			
			List<CarBrands> brands = brandsRepo.findAll();
			List<CarModels> models = modelsRepo.findAll();
			if(Objects.nonNull(models) && Objects.nonNull(brands)) {
				
				List<ValueObjectDTO> brandsObj = brands.get(0).getData();
				List<ValueObjectDTO> modelsObj = models.get(0).getData();
				
				brandsObj.stream().forEach(br ->{
					
					modelsObj.stream().forEach(mdl ->{
						if(br.getId() == mdl.getBrand_id()) {
							ValueObjectDTO dto = new ValueObjectDTO();
							dto.setId(mdl.getId());
							dto.setName(br.getName() + " : " + mdl.getName());
							dto.setCategoryName(brands.get(0).getCategoryName());
							dtos.add(dto);
						}
					});
				});
				
			}
			System.out.println("Final count : " + dtos.size());
			
			return dtos;
		}
}