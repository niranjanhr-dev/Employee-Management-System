package com.employee.employee_management_system.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public class PerformanceReviewDto {

	private Long reviewId;


	@NotNull(message = "Rating is required")
	@Min(value = 1, message = "Rating must be at least 1")
	@Max(value = 5, message = "Rating cannot be greater than 5")
	private Integer rating;

	@NotBlank(message = "Comments are required")
	private String comments;

	@NotNull(message = "Review date is required")
	@PastOrPresent(message = "Review date cannot be in the future")
	private LocalDate reviewDate;

	@NotBlank(message = "Feedback is required")
	private String feedback;

	@NotNull(message = "Employee is required")
	private Long employeeId;

	public PerformanceReviewDto() {

	}

	public PerformanceReviewDto(Long reviewId, Integer rating, String comments, LocalDate reviewDate, String feedback,
			Long employeeId) {
		this.reviewId = reviewId;
		this.rating = rating;
		this.comments = comments;
		this.reviewDate = reviewDate;
		this.feedback = feedback;
		this.employeeId = employeeId;
	}

	public Long getReviewId() {
		return reviewId;
	}

	public void setReviewId(Long reviewId) {
		this.reviewId = reviewId;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public LocalDate getReviewDate() {
		return reviewDate;
	}

	public void setReviewDate(LocalDate reviewDate) {
		this.reviewDate = reviewDate;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	@Override
	public String toString() {
		return "PerformanceReviewDto [reviewId=" + reviewId + ", rating=" + rating + ", comments=" + comments
				+ ", reviewDate=" + reviewDate + ", feedback=" + feedback + ", employeeId=" + employeeId + "]";
	}

}
