package com.findcare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {
    
    @NotBlank(message = "Department name is required")
    @Size(max = 120, message = "Department name must be at most 120 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;
    
    @NotNull(message = "Hospital ID is required")
    private Long hospitalId;
}
