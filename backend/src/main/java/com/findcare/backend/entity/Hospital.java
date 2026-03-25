package com.findcare.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Hospital name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Address is required")
    @Column(nullable = false, length = 500)
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HospitalType type;
    
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    @Column(precision = 2, scale = 1)
    private BigDecimal rating;
    
    private Double latitude;
    
    private Double longitude;
    
    private String phone;
    
    private String email;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Department> departments = new ArrayList<>();
}
