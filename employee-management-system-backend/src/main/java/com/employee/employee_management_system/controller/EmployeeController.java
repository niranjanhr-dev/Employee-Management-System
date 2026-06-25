package com.employee.employee_management_system.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.employee.employee_management_system.dto.EmployeeDto;
import com.employee.employee_management_system.dto.ProjectDto;
import com.employee.employee_management_system.service.EmployeeService;

import jakarta.validation.Valid;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@PostMapping("/employee")
	public EmployeeDto createEmployee(@Valid @RequestBody EmployeeDto dto) {

		return employeeService.createEmployee(dto);

	}

	@GetMapping("/employees")
	public List<EmployeeDto> getAllEmployees() {

		return employeeService.getAllEmployees();

	}

	@GetMapping("/employee/{id}")
	public EmployeeDto getEmployeeById(@PathVariable Long id) {

		return employeeService.getEmployeeById(id);
	}

	@PutMapping("/employee/{id}")
	public EmployeeDto updateEmployee(@PathVariable Long id,@Valid @RequestBody EmployeeDto dto) {

		return employeeService.updateEmployee(id, dto);
	}

	@DeleteMapping("/employee/{id}")
	public String deleteEmployee(@PathVariable Long id) {

		return employeeService.deleteEmployee(id);
	}

	@GetMapping("/employee/name/{employeeName}")
	public EmployeeDto getEmployeeByName(@PathVariable String employeeName) {

		return employeeService.getEmployeeByName(employeeName);
	}

	@GetMapping("/employee/designation/{designation}")
	public List<EmployeeDto> getEmployeesByDesignation(@PathVariable String designation) {

		return employeeService.getEmployeesByDesignation(designation);
	}

	@GetMapping("/employee/{employeeName}/{salary}")
	public EmployeeDto getEmployeeByNameAndSalary(@PathVariable String employeeName, @PathVariable Double salary) {

		return employeeService.getEmployeeByNameAndSalary(employeeName, salary);
	}

	@GetMapping("/employee/salary/{salary}")
	public List<EmployeeDto> getEmployeesBySalaryGreaterThan(@PathVariable Double salary) {

		return employeeService.getEmployeesBySalaryGreaterThan(salary);
	}

	@GetMapping("/employee/salary/{minSalary}/{maxSalary}")
	public List<EmployeeDto> getEmployeesBySalaryBetween(@PathVariable Double minSalary,
			@PathVariable Double maxSalary) {

		return employeeService.getEmployeesBySalaryBetween(minSalary, maxSalary);
	}

	@GetMapping("/employee/department/{departmentName}")
	public List<EmployeeDto> getEmployeesByDepartmentName(
	        @PathVariable String departmentName) {

	    return employeeService.getEmployeesByDepartmentName(
	            departmentName);
	}

	@GetMapping("/employee/{employeeId}/projects")
	public List<ProjectDto> getProjectsByEmployeeId(
	        @PathVariable Long employeeId) {

	    return employeeService.getProjectsByEmployeeId(employeeId);
	}

}
