package com.employee.employee_management_system.exception;

public class DepartmentNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;

    public DepartmentNotFoundException(String message) {
        super(message);
    }
}