package com.employee.employee_management_system.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.employee_management_system.dto.EmployeeDto;
import com.employee.employee_management_system.dto.ProjectDto;
import com.employee.employee_management_system.entity.Project;
import com.employee.employee_management_system.exception.ProjectNotFoundException;
import com.employee.employee_management_system.repository.ProjectRepository;

@Service
public class ProjectService {

	@Autowired
	private ProjectRepository projectRepository;

	private ProjectDto convertEntityToDto(Project project) {

		ProjectDto dto = new ProjectDto();

		dto.setProjectId(project.getProjectId());
		dto.setProjectName(project.getProjectName());
		dto.setClientName(project.getClientName());
		dto.setStartDate(project.getStartDate());
		dto.setEndDate(project.getEndDate());
		dto.setStatus(project.getStatus());

		return dto;
	}

	private Project convertDtoToEntity(ProjectDto dto) {

		Project project = new Project();

		project.setProjectId(dto.getProjectId());
		project.setProjectName(dto.getProjectName());
		project.setClientName(dto.getClientName());
		project.setStartDate(dto.getStartDate());
		project.setEndDate(dto.getEndDate());
		project.setStatus(dto.getStatus());

		return project;
	}

	public ProjectDto createProject(ProjectDto dto) {

		Project project = convertDtoToEntity(dto);

		Project savedProject = projectRepository.save(project);

		return convertEntityToDto(savedProject);
	}

	public List<ProjectDto> getAllProjects() {

		List<Project> projects = projectRepository.findAll();

		return projects.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	public ProjectDto getProjectById(Long projectId) {

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " not found"));

		return convertEntityToDto(project);
	}

	public ProjectDto updateProject(Long projectId, ProjectDto dto) {

		Project project = projectRepository.findById(projectId).orElse(null);

		if (project != null) {

			project.setProjectName(dto.getProjectName());
			project.setClientName(dto.getClientName());
			project.setStartDate(dto.getStartDate());
			project.setEndDate(dto.getEndDate());
			project.setStatus(dto.getStatus());

			Project updatedProject = projectRepository.save(project);

			return convertEntityToDto(updatedProject);
		}

		return null;
	}

	public String deleteProject(Long projectId) {

		Project project = projectRepository.findById(projectId).orElse(null);

		if (project != null) {

			projectRepository.delete(project);

			return "Project Deleted Successfully";
		}

		return "Project Not Found";
	}

	public List<ProjectDto> getProjectsByStatus(String status) {

		List<Project> projects = projectRepository.findByStatus(status);

		return projects.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	public List<EmployeeDto> getEmployeesByProjectId(Long projectId) {

		Project project = projectRepository.findById(projectId).orElse(null);

		if (project != null) {

			return project.getEmployees().stream().map(employee -> {

				EmployeeDto dto = new EmployeeDto();

				dto.setEmployeeId(employee.getEmployeeId());
				dto.setEmployeeName(employee.getEmployeeName());
				dto.setEmail(employee.getEmail());
				dto.setMobileNumber(employee.getMobileNumber());
				dto.setSalary(employee.getSalary());
				dto.setDesignation(employee.getDesignation());
				dto.setJoiningDate(employee.getJoiningDate());

				if (employee.getDepartment() != null) {
					dto.setDepartmentId(employee.getDepartment().getDepartmentId());
				}

				if (employee.getProjects() != null && !employee.getProjects().isEmpty()) {

					dto.setProjectIds(employee.getProjects().stream().map(Project::getProjectId).toList());
				}

				return dto;

			}).toList();
		}

		return null;
	}

}
