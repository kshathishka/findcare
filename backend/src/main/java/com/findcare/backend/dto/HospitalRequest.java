package com.findcare.backend.dto;

import com.findcare.backend.entity.HospitalType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalRequest {
    
    @NotBlank(message = "Hospital name is required")
    @Size(max = 150, message = "Hospital name must be at most 150 characters")
    private String name;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must be at most 500 characters")
    private String address;
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must be at most 100 characters")
    private String state;
    
    @Size(max = 20, message = "Zip code must be at most 20 characters")
    private String zipCode;
    
    @NotNull(message = "Hospital type is required")
    private HospitalType type;
    
    @DecimalMin(value = "0.0", message = "Rating cannot be less than 0")
    @DecimalMax(value = "5.0", message = "Rating cannot be greater than 5")
    private BigDecimal rating;
    private Double latitude;
    private Double longitude;

    @Pattern(regexp = "^$|^[+0-9\\-()\\s]{10,20}$", message = "Phone format is invalid")
    private String phone;

    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @Size(max = 500, message = "Image URL must be at most 500 characters")
    private String imageUrl;
}
