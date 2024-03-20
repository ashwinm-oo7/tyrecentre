package com.tyrecentre.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.tyrecentre.entity.Customer;
import com.tyrecentre.repo.CustomerRepo;

@Service
public class CustomerService {
	
	@Autowired
    private CustomerRepo customerRepo;


	public Optional<Customer> getProfile(@NonNull String email) {
		// TODO Auto-generated method stub
        return customerRepo.findById(email);
	}
	
    public Customer saveCustomer(Customer customer) {
        return customerRepo.save(customer);
    }

    public Customer findCustomerById(String id) {
        return customerRepo.findById(id).orElse(null);
    }

    public Customer findCustomerByEmail(String email) {
        return customerRepo.findByEmail(email);
    }

    public void deleteCustomer(String id) {
        customerRepo.deleteById(id);
    }
}
