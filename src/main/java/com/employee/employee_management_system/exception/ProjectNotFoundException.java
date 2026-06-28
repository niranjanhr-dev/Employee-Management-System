package com.employee.employee_management_system.exception;

public class ProjectNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

    public ProjectNotFoundException(String message) {
        super(message);
    }
}