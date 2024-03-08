package com.tyrecentre.service;

import java.io.IOException;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Product;
import com.tyrecentre.repo.ProductRepo;
import com.tyrecentre.utility.FileUtility;

@Service
public class ProductService {
	
	@Autowired
	ProductRepo productRepo;
	
	String fileDir = "C:\\Users\\Ashwin\\OneDrive\\Pictures\\AshwinImage\\UploadedImages\\";

	public ResponseEntity<?> addOrUpdateTyreCompany(@NonNull Product entity) {
		
		
		if(Objects.nonNull(entity)) {
			entity.getProductImages().stream().forEach( images -> {
				
				try {
					String filePath = FileUtility.saveBase64FileByName(images.getDataURL(), fileDir, images.getFileName().split("\\.")[0], images.getFileName().split("\\.")[1]);
					images.setFilePath(filePath);
					images.setDataURL(null);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});
		}
		return new ResponseEntity<>(productRepo.save(entity), HttpStatus.OK);
	}
	
}