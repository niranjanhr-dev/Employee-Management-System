package com.employee.employee_management_system.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.employee_management_system.dto.DashboardDto;
import com.employee.employee_management_system.repository.DepartmentRepository;
import com.employee.employee_management_system.repository.EmployeeRepository;
import com.employee.employee_management_system.repository.ProjectRepository;
import com.employee.employee_management_system.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public DashboardDto getDashboardStatistics() {

        DashboardDto dto = new DashboardDto();

        dto.setTotalEmployees(employeeRepository.count());

        dto.setTotalDepartments(departmentRepository.count());

        dto.setTotalProjects(projectRepository.count());

        Double averageSalary = employeeRepository.getAverageSalary();

        if (averageSalary == null) {
            averageSalary = 0.0;
        }

        dto.setAverageSalary(averageSalary);

        return dto;
    }

}