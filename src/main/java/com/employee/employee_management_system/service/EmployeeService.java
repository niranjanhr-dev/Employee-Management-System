package com.employee.employee_management_system.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.employee_management_system.dto.EmployeeDto;
import com.employee.employee_management_system.dto.ProjectDto;
import com.employee.employee_management_system.entity.Department;
import com.employee.employee_management_system.entity.Employee;
import com.employee.employee_management_system.entity.Project;
import com.employee.employee_management_system.exception.EmployeeNotFoundException;
import com.employee.employee_management_system.repository.DepartmentRepository;
import com.employee.employee_management_system.repository.EmployeeRepository;
import com.employee.employee_management_system.repository.ProjectRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private ProjectRepository projectRepository;

	// ===================== ENTITY TO DTO =====================

	private EmployeeDto convertEntityToDto(Employee emp) {

		EmployeeDto dto = new EmployeeDto();

		dto.setEmployeeId(emp.getEmployeeId());
		dto.setEmployeeName(emp.getEmployeeName());
		dto.setEmail(emp.getEmail());
		dto.setMobileNumber(emp.getMobileNumber());
		dto.setSalary(emp.getSalary());
		dto.setDesignation(emp.getDesignation());
		dto.setJoiningDate(emp.getJoiningDate());

		if (emp.getDepartment() != null) {
			dto.setDepartmentId(emp.getDepartment().getDepartmentId());
		}

		if (emp.getProjects() != null && !emp.getProjects().isEmpty()) {

			dto.setProjectIds(emp.getProjects().stream().map(Project::getProjectId).collect(Collectors.toList()));
		}

		return dto;
	}

	// ===================== DTO TO ENTITY =====================

	private Employee convertDtoToEntity(EmployeeDto dto) {

		Employee emp = new Employee();

		emp.setEmployeeId(dto.getEmployeeId());
		emp.setEmployeeName(dto.getEmployeeName());
		emp.setEmail(dto.getEmail());
		emp.setMobileNumber(dto.getMobileNumber());
		emp.setSalary(dto.getSalary());
		emp.setDesignation(dto.getDesignation());
		emp.setJoiningDate(dto.getJoiningDate());

		if (dto.getDepartmentId() != null) {

			Department department = departmentRepository.findById(dto.getDepartmentId()).orElse(null);

			emp.setDepartment(department);
		}

		if (dto.getProjectIds() != null && !dto.getProjectIds().isEmpty()) {

			List<Project> projects = projectRepository.findAllById(dto.getProjectIds());

			emp.setProjects(projects);
		}

		return emp;
	}

	// ===================== CREATE =====================

	public EmployeeDto createEmployee(EmployeeDto dto) {

		Employee emp = convertDtoToEntity(dto);

		Employee savedEmployee = employeeRepository.save(emp);

		return convertEntityToDto(savedEmployee);
	}

	// ===================== GET ALL =====================

	public List<EmployeeDto> getAllEmployees() {

		return employeeRepository.findAll().stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	// ===================== GET BY ID =====================

	// ===================== GET BY ID =====================

	public EmployeeDto getEmployeeById(Long id) {

		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new EmployeeNotFoundException("Employee with ID " + id + " not found"));

		return convertEntityToDto(employee);
	}

	// ===================== UPDATE =====================

	public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {

		Optional<Employee> optionalEmployee = employeeRepository.findById(id);

		if (optionalEmployee.isPresent()) {

			Employee employee = optionalEmployee.get();

			employee.setEmployeeName(dto.getEmployeeName());
			employee.setEmail(dto.getEmail());
			employee.setMobileNumber(dto.getMobileNumber());
			employee.setSalary(dto.getSalary());
			employee.setDesignation(dto.getDesignation());
			employee.setJoiningDate(dto.getJoiningDate());

			// Update Department
			if (dto.getDepartmentId() != null) {

				Department department = departmentRepository.findById(dto.getDepartmentId()).orElse(null);

				employee.setDepartment(department);
			}

			// Update Projects
			if (dto.getProjectIds() != null && !dto.getProjectIds().isEmpty()) {

				List<Project> projects = projectRepository.findAllById(dto.getProjectIds());

				employee.setProjects(projects);
			}

			Employee updatedEmployee = employeeRepository.save(employee);

			return convertEntityToDto(updatedEmployee);
		}

		return null;
	}

	// ===================== DELETE =====================

	public String deleteEmployee(Long id) {

		employeeRepository.deleteById(id);

		return "Employee Deleted Successfully";
	}

	// ===================== FIND BY NAME =====================

	public EmployeeDto getEmployeeByName(String employeeName) {

		Employee employee = employeeRepository.findByEmployeeName(employeeName);

		return convertEntityToDto(employee);
	}

	// ===================== FIND BY DESIGNATION =====================

	public List<EmployeeDto> getEmployeesByDesignation(String designation) {

		List<Employee> employees = employeeRepository.findByDesignation(designation);

		return employees.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	// ===================== FIND BY NAME AND SALARY =====================

	public EmployeeDto getEmployeeByNameAndSalary(String employeeName, Double salary) {

		Employee employee = employeeRepository.findByEmployeeNameAndSalary(employeeName, salary);

		return convertEntityToDto(employee);
	}

	// ===================== FIND BY SALARY GREATER THAN =====================

	public List<EmployeeDto> getEmployeesBySalaryGreaterThan(Double salary) {

		List<Employee> employees = employeeRepository.findBySalaryGreaterThan(salary);

		return employees.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	// ===================== FIND BY SALARY BETWEEN =====================

	public List<EmployeeDto> getEmployeesBySalaryBetween(Double minSalary, Double maxSalary) {

		List<Employee> employees = employeeRepository.findBySalaryBetween(minSalary, maxSalary);

		return employees.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	// ===================== FIND BY DEPARTMENT NAME =====================

	public List<EmployeeDto> getEmployeesByDepartmentName(String departmentName) {

		List<Employee> employees = employeeRepository.findByDepartmentDepartmentName(departmentName);

		return employees.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	public List<ProjectDto> getProjectsByEmployeeId(Long employeeId) {

		Employee employee = employeeRepository.findById(employeeId).orElse(null);

		if (employee != null) {

			return employee.getProjects().stream().map(project -> {

				ProjectDto dto = new ProjectDto();

				dto.setProjectId(project.getProjectId());
				dto.setProjectName(project.getProjectName());
				dto.setClientName(project.getClientName());
				dto.setStartDate(project.getStartDate());
				dto.setEndDate(project.getEndDate());
				dto.setStatus(project.getStatus());

				return dto;

			}).collect(Collectors.toList());
		}

		return null;
	}

}