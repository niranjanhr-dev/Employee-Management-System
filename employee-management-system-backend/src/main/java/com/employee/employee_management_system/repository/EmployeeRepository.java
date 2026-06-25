package com.employee.employee_management_system.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.employee_management_system.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Employee findByEmployeeName(String employeeName);

	List<Employee> findByDesignation(String designation);

	Employee findByEmployeeNameAndSalary(String employeeName, Double salary);

	List<Employee> findBySalaryGreaterThan(Double salary);

	List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);

	List<Employee> findByDepartmentDepartmentName(String departmentName);
	
	@Query("SELECT AVG(e.salary) FROM Employee e")
	Double getAverageSalary();

}