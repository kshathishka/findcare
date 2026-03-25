package com.findcare.backend.service;

import com.findcare.backend.dto.DashboardStats;
import com.findcare.backend.entity.AppointmentStatus;
import com.findcare.backend.entity.Role;
import com.findcare.backend.repository.AppointmentRepository;
import com.findcare.backend.repository.DoctorRepository;
import com.findcare.backend.repository.HospitalRepository;
import com.findcare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    
    @PreAuthorize("hasAuthority('ADMIN')")
    public DashboardStats getAdminDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalHospitals(hospitalRepository.count());
        stats.setTotalDoctors(doctorRepository.count());
        stats.setTotalPatients((long) userRepository.findByRole(Role.PATIENT).size());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setTodayAppointments(appointmentRepository.findByDate(LocalDate.now(), Pageable.unpaged()).getTotalElements());
        stats.setPendingAppointments((long) appointmentRepository.findByStatus(AppointmentStatus.SCHEDULED).size());
        
        return stats;
    }
}
