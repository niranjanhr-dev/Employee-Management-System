package com.employee.employee_management_system.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.employee_management_system.dto.DepartmentDto;
import com.employee.employee_management_system.entity.Department;
import com.employee.employee_management_system.exception.DepartmentNotFoundException;
import com.employee.employee_management_system.repository.DepartmentRepository;

@Service
public class DepartmentService {

	@Autowired
	private DepartmentRepository departmentRepository;

	private DepartmentDto convertEntityToDto(Department dept) {

		DepartmentDto dto = new DepartmentDto();

		dto.setDepartmentId(dept.getDepartmentId());
		dto.setDepartmentName(dept.getDepartmentName());
		dto.setLocation(dept.getLocation());
		dto.setBudget(dept.getBudget());

		return dto;
	}

	private Department convertDtoToEntity(DepartmentDto dto) {

		Department dept = new Department();

		dept.setDepartmentId(dto.getDepartmentId());
		dept.setDepartmentName(dto.getDepartmentName());
		dept.setLocation(dto.getLocation());
		dept.setBudget(dto.getBudget());

		return dept;
	}

	public DepartmentDto createDepartment(DepartmentDto dto) {

		Department dept = convertDtoToEntity(dto);

		Department savedDepartment = departmentRepository.save(dept);

		return convertEntityToDto(savedDepartment);
	}

	public List<DepartmentDto> getAllDepartments() {

		List<Department> departments = departmentRepository.findAll();

		return departments.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	public DepartmentDto getDepartmentById(Long departmentId) {

		Department department = departmentRepository.findById(departmentId).orElseThrow(
				() -> new DepartmentNotFoundException("Department with ID " + departmentId + " not found"));

		return convertEntityToDto(department);
	}

	public DepartmentDto updateDepartment(Long departmentId, DepartmentDto dto) {

		Department department = departmentRepository.findById(departmentId).orElse(null);

		if (department != null) {

			department.setDepartmentName(dto.getDepartmentName());
			department.setLocation(dto.getLocation());
			department.setBudget(dto.getBudget());

			Department updatedDepartment = departmentRepository.save(department);

			return convertEntityToDto(updatedDepartment);
		}

		return null;
	}

	public String deleteDepartment(Long departmentId) {

		Department department = departmentRepository.findById(departmentId).orElse(null);

		if (department != null) {

			departmentRepository.delete(department);

			return "Department Deleted Successfully";
		}

		return "Department Not Found";
	}
}