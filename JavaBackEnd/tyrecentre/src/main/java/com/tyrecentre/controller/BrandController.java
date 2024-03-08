package com.tyrecentre.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.lang.NonNull;
import com.tyrecentre.entity.Brand;
import com.tyrecentre.repo.BrandRepo;
import com.tyrecentre.service.BrandService;

@RestController
@RequestMapping("/brand")
class BrandController {
	
    @Autowired
    private BrandService brandService;
    
    @Autowired
	BrandRepo brandRepo;
   
    @PostMapping("/add")
    public ResponseEntity<?> addBrand(@RequestBody @NonNull Brand entity) {
        try {

            ResponseEntity<?> response  = brandService.addOrUpdateTyreCompany(entity);
            return response;
        } catch (Exception e) {
            System.err.println("Error during Brand creation: " + e.getMessage());
            return new ResponseEntity<>("Error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/getTyreCompanyBySubcategoryName/{subCategoryName}")
    public List<Brand> getTyreCompanyBySubcategoryName(@PathVariable String subCategoryName) {
    	List<Brand> brand = brandService.getTyreCompanyBySubcategoryName(subCategoryName);
        if (Objects.isNull(brand)) {
            return null;
        }
        return brand;
    }

}
