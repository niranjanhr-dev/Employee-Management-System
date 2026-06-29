# Employee Management System

A full-stack employee management app built with Spring Boot, React, and MySQL.
It provides CRUD workflows for employees, departments, projects, and performance reviews.

## Overview

The project uses a layered architecture:

- React frontend for the user interface
- Spring Boot backend for REST APIs and business logic
- MySQL for persistent storage

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts, Lucide React
- Backend: Spring Boot, Spring Data JPA, Validation, Maven
- Database: MySQL

## Features

- Employee management
- Department management
- Project management
- Performance reviews
- Dashboard with summary metrics and charts
- Form validation and error handling
- Responsive UI

## Project Structure

- `employee-management-system-backend/`: backend application
- `employee-management-system-frontend/`: frontend application
- `docs/images/`: screenshots and architecture diagram

## System Architecture

The frontend sends requests to the backend REST APIs. The backend handles validation, business logic, and persistence through JPA/Hibernate, then returns JSON responses to the UI.

## Installation

### Backend

```bash
cd employee-management-system-backend
mvn spring-boot:run
```

### Frontend

```bash
cd employee-management-system-frontend
npm install
npm run dev
```

### Database

Configure the backend with your MySQL connection details through environment variables.
Copy [`employee-management-system-backend/.env.example`](./employee-management-system-backend/.env.example) to a local `.env` file or set the variables in your IDE:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JPA_DDL_AUTO`
- `JPA_SHOW_SQL`
- `JPA_FORMAT_SQL`
