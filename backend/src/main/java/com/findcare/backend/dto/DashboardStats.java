package com.findcare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalHospitals;
    private Long totalDoctors;
    private Long totalPatients;
    private Long totalAppointments;
    private Long todayAppointments;
    private Long pendingAppointments;
}
