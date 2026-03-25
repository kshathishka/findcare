package com.findcare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    @NotBlank(message = "Specialization is required")
    @Size(max = 120, message = "Specialization must be at most 120 characters")
    private String specialization;
    
    @NotBlank(message = "Qualification is required")
    @Size(max = 150, message = "Qualification must be at most 150 characters")
    private String qualification;
    
    @NotNull(message = "Years of experience is required")
    @Positive(message = "Years of experience must be greater than 0")
    private Integer yearsOfExperience;
    
    @Positive(message = "Consultation fee must be greater than 0")
    private BigDecimal consultationFee;

    @Size(max = 100, message = "License number must be at most 100 characters")
    private String licenseNumber;

    @Size(max = 1000, message = "Bio must be at most 1000 characters")
    private String bio;

    @Size(max = 500, message = "Profile image URL must be at most 500 characters")
    private String profileImageUrl;
    private Boolean isAvailable;
}
