package com.employee.employee_management_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.employee_management_system.entity.PerformanceReview;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
	List<PerformanceReview> findByRatingGreaterThan(Integer rating);

	List<PerformanceReview> findByReviewDateBetween(LocalDate startDate, LocalDate endDate);

}