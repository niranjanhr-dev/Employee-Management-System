package com.employee.employee_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employee.employee_management_system.dto.DashboardDto;
import com.employee.employee_management_system.service.DashboardService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    public DashboardDto getDashboardStatistics() {
        return dashboardService.getDashboardStatistics();
    }
}