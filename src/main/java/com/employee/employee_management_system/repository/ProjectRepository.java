package com.employee.employee_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.employee_management_system.entity.Project;

public interface ProjectRepository

	extends JpaRepository<Project, Long> {

	List<Project> findByStatus(String status);



}
