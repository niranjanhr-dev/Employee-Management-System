package com.employee.employee_management_system.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.employee.employee_management_system.dto.PerformanceReviewDto;
import com.employee.employee_management_system.service.PerformanceReviewService;

import jakarta.validation.Valid;

@RestController
public class PerformanceReviewController {

	@Autowired
	private PerformanceReviewService performanceReviewService;

	@PostMapping("/review")
	public PerformanceReviewDto createReview(@Valid @RequestBody PerformanceReviewDto dto) {

		return performanceReviewService.createReview(dto);
	}

	@GetMapping("/reviews")
	public List<PerformanceReviewDto> getAllReviews() {

		return performanceReviewService.getAllReviews();
	}

	@GetMapping("/review/{reviewId}")
	public PerformanceReviewDto getReviewById(@PathVariable Long reviewId) {

		return performanceReviewService.getReviewById(reviewId);
	}

	@PutMapping("/review/{reviewId}")
	public PerformanceReviewDto updateReview(@PathVariable Long reviewId, @Valid @RequestBody PerformanceReviewDto dto) {

		return performanceReviewService.updateReview(reviewId, dto);
	}

	@DeleteMapping("/review/{reviewId}")
	public String deleteReview(@PathVariable Long reviewId) {

		return performanceReviewService.deleteReview(reviewId);
	}

	@GetMapping("/review/rating/{rating}")
	public List<PerformanceReviewDto> getReviewsByRatingGreaterThan(@PathVariable Integer rating) {

		return performanceReviewService.getReviewsByRatingGreaterThan(rating);
	}

	@GetMapping("/review/date")
	public List<PerformanceReviewDto> getReviewsByReviewDateBetween(

			@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {

		return performanceReviewService.getReviewsByReviewDateBetween(startDate, endDate);
	}
}