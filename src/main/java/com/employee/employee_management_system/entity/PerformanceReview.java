package com.employee.employee_management_system.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "performance_review")
public class PerformanceReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reviewId;

	private Integer rating;

	private String comments;

	private LocalDate reviewDate;

	private String feedback;

	@ManyToOne
	@JoinColumn(name = "employee_id")

	private Employee employee;

	public PerformanceReview() {

	}

	public PerformanceReview(Long reviewId, Integer rating, String comments, LocalDate reviewDate, String feedback,
			Employee employee) {
		this.reviewId = reviewId;
		this.rating = rating;
		this.comments = comments;
		this.reviewDate = reviewDate;
		this.feedback = feedback;
		this.employee = employee;
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

	@Override
	public String toString() {
		return "PerformanceReview [reviewId=" + reviewId + ", rating=" + rating + ", comments=" + comments
				+ ", reviewDate=" + reviewDate + ", feedback=" + feedback + "]";
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

}