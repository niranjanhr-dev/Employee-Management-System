package com.employee.employee_management_system.dto;

public class DashboardDto {

    private Long totalEmployees;

    private Long totalDepartments;

    private Long totalProjects;

    private Double averageSalary;

    public DashboardDto() {

    }

    public DashboardDto(Long totalEmployees,
                        Long totalDepartments,
                        Long totalProjects,
                        Double averageSalary) {

        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.totalProjects = totalProjects;
        this.averageSalary = averageSalary;
    }

    public Long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public Long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(Long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public Long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(Long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public Double getAverageSalary() {
        return averageSalary;
    }

    public void setAverageSalary(Double averageSalary) {
        this.averageSalary = averageSalary;
    }

    @Override
    public String toString() {
        return "DashboardDto [totalEmployees=" + totalEmployees
                + ", totalDepartments=" + totalDepartments
                + ", totalProjects=" + totalProjects
                + ", averageSalary=" + averageSalary + "]";
    }

}