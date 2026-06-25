package com.employee.employee_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

@SpringBootTest
class EmployeeServiceTest {

	@Autowired
    private EmployeeService employeeService;
	
	@Test
	void testEmployeeServiceNotNull() {

	    assertNotNull(employeeService);

	}


}