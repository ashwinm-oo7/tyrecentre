package com.tyrecentre.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Brand;
import com.tyrecentre.repo.BrandRepo;

@Service
public class BrandService {
	
	@Autowired
	BrandRepo brandRepo;
	
	    public ResponseEntity<?> addOrUpdateTyreCompany(@NonNull Brand brand) {
	
        try {
            if(brand.getId() == null) {
                return new ResponseEntity<>(brandRepo.save(brand), HttpStatus.CREATED);
            }
            Optional<Brand> tyreCompanyOptional = brandRepo.findById(brand.getId());
            if (!tyreCompanyOptional.isPresent()) {
                return new ResponseEntity<>("TyreCompany not found", HttpStatus.NOT_FOUND);
            }
            if(tyreCompanyOptional.isPresent()) {
                Brand existingBrand = tyreCompanyOptional.get();
                // Update the fields of existingTyreCompany with the values from updatedTyreCompany
                existingBrand.setTyreCompanyName(brand.getTyreCompanyName());
                existingBrand.setTyreCompanyDescription(brand.getTyreCompanyDescription());

                // Save the updated TyreCompany
                brandRepo.save(existingBrand);
                return new ResponseEntity<>("TyreCompany updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("TyreCompany not updated", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Error updating TyreCompany: " + e.getMessage());
            return new ResponseEntity<>("Failed to update TyreCompany. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
         
    }

		public List<Brand> getTyreCompanyBySubcategoryName(String subCategoryName) {
			return brandRepo.getTyreCompanyBySubcategoryName(subCategoryName);
		}
}