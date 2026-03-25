package com.findcare.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnore
    private Doctor doctor;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate date;
    
    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(name = "max_patients")
    private Integer maxPatients = 1;
    
    @Column(name = "booked_patients")
    private Integer bookedPatients = 0;
}
