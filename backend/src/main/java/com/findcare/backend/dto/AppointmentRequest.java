package com.findcare.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Time slot ID is required")
    private Long timeSlotId;
    
    @Size(max = 1000, message = "Patient notes must be at most 1000 characters")
    private String patientNotes;

    @Size(max = 500, message = "Symptoms must be at most 500 characters")
    private String symptoms;
}
