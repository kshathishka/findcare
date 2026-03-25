package com.findcare.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnore
    private Department department;
    
    @NotBlank(message = "Specialization is required")
    private String specialization;
    
    @NotBlank(message = "Qualification is required")
    private String qualification;
    
    @NotNull
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;
    
    @Column(name = "license_number")
    private String licenseNumber;
    
    @Column(length = 1000)
    private String bio;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<TimeSlot> timeSlots = new ArrayList<>();
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();
}
