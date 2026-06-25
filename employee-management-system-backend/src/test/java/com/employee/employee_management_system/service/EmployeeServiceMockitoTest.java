package com.employee.employee_management_system.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.employee.employee_management_system.dto.EmployeeDto;
import com.employee.employee_management_system.entity.Department;
import com.employee.employee_management_system.entity.Employee;
import com.employee.employee_management_system.repository.DepartmentRepository;
import com.employee.employee_management_system.repository.EmployeeRepository;
import com.employee.employee_management_system.repository.ProjectRepository;

import org.mockito.InjectMocks;
import org.mockito.Mock;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceMockitoTest {

	@Mock
	private EmployeeRepository employeeRepository;

	@InjectMocks
	private EmployeeService employeeService;

	@Mock
	private DepartmentRepository departmentRepository;

	@Mock
	private ProjectRepository projectRepository;

	@Test
	void testGetEmployeeByName() {

		Employee employee = new Employee();

		employee.setEmployeeId(1L);
		employee.setEmployeeName("Niranjan");

		when(employeeRepository.findByEmployeeName("Niranjan")).thenReturn(employee);

		assertEquals("Niranjan", employeeService.getEmployeeByName("Niranjan").getEmployeeName());
	}

	@Test
	void testCreateEmployee() {

		EmployeeDto dto = new EmployeeDto();

		dto.setEmployeeName("Niranjan");
		dto.setEmail("niranjan@gmail.com");
		dto.setMobileNumber("9876543210");
		dto.setSalary(50000.0);
		dto.setDesignation("Java Developer");
		dto.setJoiningDate(LocalDate.now());
		dto.setDepartmentId(1L);

		Employee employee = new Employee();

		employee.setEmployeeId(1L);
		employee.setEmployeeName("Niranjan");
		employee.setEmail("niranjan@gmail.com");
		employee.setMobileNumber("9876543210");
		employee.setSalary(50000.0);
		employee.setDesignation("Java Developer");
		employee.setJoiningDate(LocalDate.now());

		when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

		EmployeeDto result = employeeService.createEmployee(dto);
		assertEquals("Niranjan", result.getEmployeeName());

		verify(employeeRepository).save(any(Employee.class));

	}

	@Test
	void testGetEmployeeById() {

		Employee employee = new Employee();

		employee.setEmployeeId(1L);
		employee.setEmployeeName("Niranjan");
		employee.setEmail("niranjan@gmail.com");
		employee.setMobileNumber("9876543210");
		employee.setSalary(50000.0);
		employee.setDesignation("Java Developer");
		employee.setJoiningDate(LocalDate.now());

		when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

		EmployeeDto result = employeeService.getEmployeeById(1L);
		assertEquals("Niranjan", result.getEmployeeName());
		verify(employeeRepository).findById(1L);

	}

	@Test
	void testUpdateEmployee() {

		// Create DTO
		EmployeeDto dto = new EmployeeDto();
		dto.setEmployeeName("Niranjan Updated");
		dto.setEmail("niranjanupdated@gmail.com");
		dto.setMobileNumber("9876543210");
		dto.setSalary(60000.0);
		dto.setDesignation("Senior Java Developer");
		dto.setJoiningDate(LocalDate.now());
		dto.setDepartmentId(1L);

		// Existing Employee
		Employee employee = new Employee();
		employee.setEmployeeId(1L);
		employee.setEmployeeName("Niranjan");
		employee.setEmail("niranjan@gmail.com");
		employee.setMobileNumber("9876543210");
		employee.setSalary(50000.0);
		employee.setDesignation("Java Developer");
		employee.setJoiningDate(LocalDate.now());

		// Mock findById()

		Department department = new Department();
		department.setDepartmentId(1L);
		department.setDepartmentName("IT");

		when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));

		when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

		// Mock save()
		when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

		// Call Service
		EmployeeDto result = employeeService.updateEmployee(1L, dto);

		// Verify Result
		assertEquals("Niranjan Updated", result.getEmployeeName());

		// Verify Repository Calls
		verify(employeeRepository).findById(1L);
		verify(employeeRepository).save(any(Employee.class));

	}

	@Test
	void testDeleteEmployee() {

		// Call the service method
		String result = employeeService.deleteEmployee(1L);

		// Check the returned message
		assertEquals("Employee Deleted Successfully", result);

		// Verify deleteById() was called
		verify(employeeRepository).deleteById(1L);

	}

}
