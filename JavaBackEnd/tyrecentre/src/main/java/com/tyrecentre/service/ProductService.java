package com.tyrecentre.service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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
	
	@Autowired
	Environment env;
	
	public static String fileDir;
	public ProductService(Environment env) {
		fileDir 			= env.getProperty("PRODUCT_IMAGE_PATH");
	}

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

	public List<Product> getAllProducts() {
		
		List<Product> productList = productRepo.findAll();
        	productList.stream().forEach(p ->{
        		p.getProductImages().stream().forEach( img ->{
        			try {
        				String data = FileUtility.getBase64Image(img.getFilePath());
						img.setDataURL(data);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
        		});
        	});
		return productList;
	}

	public Product getProductById(String id) {
		Optional<Product> product = productRepo.findById(id);
		
		if(product.isPresent() && Objects.nonNull(product.get())) {
			product.get().getProductImages().stream().forEach( images -> {
				try {
					String base64Str = FileUtility.getBase64Image(images.getFilePath());
					images.setDataURL(base64Str);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			});
		}
		return product.isPresent() ? product.get() : null;
	}
	
}