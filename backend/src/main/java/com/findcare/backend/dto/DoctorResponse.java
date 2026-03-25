package com.findcare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String doctorName;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private Long hospitalId;
    private String hospitalName;
    private String specialization;
    private String qualification;
    private Integer yearsOfExperience;
    private BigDecimal consultationFee;
    private String licenseNumber;
    private String bio;
    private String profileImageUrl;
    private Boolean isAvailable;
}
