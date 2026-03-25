package com.findcare.backend.dto;

import com.findcare.backend.entity.HospitalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private HospitalType type;
    private BigDecimal rating;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String email;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
}
