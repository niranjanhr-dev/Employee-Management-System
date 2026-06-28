package com.employee.employee_management_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.employee.employee_management_system.dto.EmployeeDto;
import com.employee.employee_management_system.dto.ProjectDto;
import com.employee.employee_management_system.service.ProjectService;

import jakarta.validation.Valid;

@RestController
public class ProjectController {


	@Autowired
	private ProjectService projectService;

	@PostMapping("/project")
	public ProjectDto createProject(@Valid @RequestBody ProjectDto dto) {

	    return projectService.createProject(dto);
	}

	@GetMapping("/projects")
	public List<ProjectDto> getAllProjects() {

	    return projectService.getAllProjects();
	}

	@GetMapping("/project/{projectId}")
	public ProjectDto getProjectById(@PathVariable Long projectId) {

	    return projectService.getProjectById(projectId);
	}

	@PutMapping("/project/{projectId}")
	public ProjectDto updateProject(
	        @PathVariable Long projectId,
	       @Valid @RequestBody ProjectDto dto) {

	    return projectService.updateProject(projectId, dto);
	}

	@DeleteMapping("/project/{projectId}")
	public String deleteProject(@PathVariable Long projectId) {

	    return projectService.deleteProject(projectId);
	}

	@GetMapping("/project/status/{status}")
	public List<ProjectDto> getProjectsByStatus(
	        @PathVariable String status) {

	    return projectService.getProjectsByStatus(status);
	}

	@GetMapping("/project/{projectId}/employees")
	public List<EmployeeDto> getEmployeesByProjectId(
	        @PathVariable Long projectId) {

	    return projectService.getEmployeesByProjectId(projectId);
	}

}
