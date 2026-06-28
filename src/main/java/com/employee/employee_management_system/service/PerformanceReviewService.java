package com.employee.employee_management_system.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.employee_management_system.dto.PerformanceReviewDto;
import com.employee.employee_management_system.entity.Employee;
import com.employee.employee_management_system.entity.PerformanceReview;
import com.employee.employee_management_system.exception.ReviewNotFoundException;
import com.employee.employee_management_system.repository.EmployeeRepository;
import com.employee.employee_management_system.repository.PerformanceReviewRepository;

@Service
public class PerformanceReviewService {

	@Autowired
	private PerformanceReviewRepository performanceReviewRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	private PerformanceReviewDto convertEntityToDto(PerformanceReview review) {

		PerformanceReviewDto dto = new PerformanceReviewDto();

		dto.setReviewId(review.getReviewId());
		dto.setRating(review.getRating());
		dto.setComments(review.getComments());
		dto.setReviewDate(review.getReviewDate());
		dto.setFeedback(review.getFeedback());

		if (review.getEmployee() != null) {
			dto.setEmployeeId(review.getEmployee().getEmployeeId());
		}

		return dto;
	}

	private PerformanceReview convertDtoToEntity(PerformanceReviewDto dto) {

		PerformanceReview review = new PerformanceReview();

		review.setReviewId(dto.getReviewId());
		review.setRating(dto.getRating());
		review.setComments(dto.getComments());
		review.setReviewDate(dto.getReviewDate());
		review.setFeedback(dto.getFeedback());

		if (dto.getEmployeeId() != null) {

			Employee employee = employeeRepository.findById(dto.getEmployeeId()).orElse(null);

			review.setEmployee(employee);
		}

		return review;
	}

	public PerformanceReviewDto createReview(PerformanceReviewDto dto) {

		PerformanceReview review = convertDtoToEntity(dto);

		PerformanceReview savedReview = performanceReviewRepository.save(review);

		return convertEntityToDto(savedReview);
	}

	public List<PerformanceReviewDto> getAllReviews() {

		return performanceReviewRepository.findAll().stream().map(this::convertEntityToDto)
				.collect(Collectors.toList());
	}

	public PerformanceReviewDto getReviewById(Long reviewId) {

		PerformanceReview review = performanceReviewRepository.findById(reviewId)
				.orElseThrow(() -> new ReviewNotFoundException("Review with ID " + reviewId + " not found"));

		return convertEntityToDto(review);
	}

	public PerformanceReviewDto updateReview(Long reviewId, PerformanceReviewDto dto) {

		PerformanceReview review = performanceReviewRepository.findById(reviewId).orElse(null);

		if (review != null) {

			review.setRating(dto.getRating());
			review.setComments(dto.getComments());
			review.setReviewDate(dto.getReviewDate());
			review.setFeedback(dto.getFeedback());

			if (dto.getEmployeeId() != null) {

				Employee employee = employeeRepository.findById(dto.getEmployeeId()).orElse(null);

				review.setEmployee(employee);
			}

			PerformanceReview updatedReview = performanceReviewRepository.save(review);

			return convertEntityToDto(updatedReview);
		}

		return null;
	}

	public String deleteReview(Long reviewId) {

		PerformanceReview review = performanceReviewRepository.findById(reviewId).orElse(null);

		if (review != null) {

			performanceReviewRepository.delete(review);

			return "Performance Review Deleted Successfully";
		}

		return "Performance Review Not Found";
	}

	public List<PerformanceReviewDto> getReviewsByRatingGreaterThan(Integer rating) {

		List<PerformanceReview> reviews = performanceReviewRepository.findByRatingGreaterThan(rating);

		return reviews.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

	public List<PerformanceReviewDto> getReviewsByReviewDateBetween(LocalDate startDate, LocalDate endDate) {

		List<PerformanceReview> reviews = performanceReviewRepository.findByReviewDateBetween(startDate, endDate);

		return reviews.stream().map(this::convertEntityToDto).collect(Collectors.toList());
	}

}