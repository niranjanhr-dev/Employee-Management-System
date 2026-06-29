package com.employee.employee_management_system.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class ProjectDto {



	private Long projectId;

	@NotBlank(message = "Project name is required")
	private String projectName;

	@NotBlank(message = "Client name is required")
	private String clientName;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;


	private LocalDate endDate;

	@NotBlank(message = "Project status is required")
	private String status;

	public ProjectDto() {

	}

	public ProjectDto(Long projectId, String projectName, String clientName, LocalDate startDate, LocalDate endDate,
			String status) {

		this.projectId = projectId;
		this.projectName = projectName;
		this.clientName = clientName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "ProjectDto [projectId=" + projectId + ", projectName=" + projectName + ", clientName=" + clientName
				+ ", startDate=" + startDate + ", endDate=" + endDate + ", status=" + status + "]";
	}

}
