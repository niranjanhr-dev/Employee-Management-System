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

import com.employee.employee_management_system.dto.DepartmentDto;
import com.employee.employee_management_system.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping("/department")
    public DepartmentDto createDepartment(
           @Valid @RequestBody DepartmentDto dto) {

        return departmentService.createDepartment(dto);
    }

    @GetMapping("/departments")
    public List<DepartmentDto> getAllDepartments() {

        return departmentService.getAllDepartments();
    }

    @GetMapping("/department/{departmentId}")
    public DepartmentDto getDepartmentById(@PathVariable Long departmentId) {

        return departmentService.getDepartmentById(departmentId);
    }

    @PutMapping("/department/{departmentId}")
    public DepartmentDto updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentDto dto) {

        return departmentService.updateDepartment(departmentId, dto);
    }

    @DeleteMapping("/department/{departmentId}")
    public String deleteDepartment(@PathVariable Long departmentId) {

        return departmentService.deleteDepartment(departmentId);
    }
}