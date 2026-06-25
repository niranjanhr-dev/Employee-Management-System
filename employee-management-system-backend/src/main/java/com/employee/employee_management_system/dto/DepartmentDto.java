package com.employee.employee_management_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DepartmentDto {



	private Long departmentId;

	@NotBlank(message = "Department name is required")
	private String departmentName;


	@NotBlank(message = "Location is required")
	private String location;


	@NotNull(message = "Budget is required")
	@Positive(message = "Budget must be greater than zero")
	private Double budget;

	public DepartmentDto() {

	}

	public DepartmentDto(Long departmentId, String departmentName, String location, Double budget) {

		this.departmentId = departmentId;
		this.departmentName = departmentName;
		this.location = location;
		this.budget = budget;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Double getBudget() {
		return budget;
	}

	public void setBudget(Double budget) {
		this.budget = budget;
	}

	@Override
	public String toString() {
		return "DepartmentDto [departmentId=" + departmentId + ", departmentName=" + departmentName + ", location="
				+ location + ", budget=" + budget + "]";
	}

}
