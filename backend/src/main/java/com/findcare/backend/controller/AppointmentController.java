package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.AppointmentRequest;
import com.findcare.backend.dto.AppointmentResponse;
import com.findcare.backend.dto.PagedResponse;
import com.findcare.backend.service.CurrentUserService;
import com.findcare.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    private final CurrentUserService currentUserService;
    
    @PostMapping
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        Long patientId = currentUserService.getUserIdByEmail(authentication.getName());
        AppointmentResponse appointment = appointmentService.createAppointment(patientId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Appointment booked successfully", appointment));
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentResponse>>> getPatientAppointments(
            @PathVariable Long patientId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            Authentication authentication) {
        Long authenticatedPatientId = currentUserService.getUserIdByEmail(authentication.getName());
        if (!authenticatedPatientId.equals(patientId)) {
            patientId = authenticatedPatientId;
        }
        return ResponseEntity.ok(ApiResponse.success(
                "Patient appointments retrieved successfully",
                PagedResponse.from(appointmentService.getPatientAppointments(patientId, pageable))
        ));
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentResponse>>> getDoctorAppointments(
            @PathVariable Long doctorId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Doctor appointments retrieved successfully",
                PagedResponse.from(appointmentService.getDoctorAppointments(doctorId, pageable))
        ));
    }
    
    @GetMapping("/today")
    @PreAuthorize("hasAnyAuthority('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentResponse>>> getTodayAppointments(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Today's appointments retrieved successfully",
                PagedResponse.from(appointmentService.getTodayAppointments(pageable))
        ));
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentResponse>>> searchAppointments(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Appointment search completed",
                PagedResponse.from(appointmentService.searchAppointments(keyword, pageable))
        ));
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        Long patientId = currentUserService.getUserIdByEmail(authentication.getName());
        AppointmentResponse appointment = appointmentService.cancelAppointment(id, patientId);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", appointment));
    }
    
    @PutMapping("/{id}/checkin")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> checkInAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        String receptionistName = authentication.getName();
        AppointmentResponse appointment = appointmentService.checkInAppointment(id, receptionistName);
        return ResponseEntity.ok(ApiResponse.success("Patient checked in successfully", appointment));
    }
    
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> completeAppointment(
            @PathVariable Long id,
            @RequestParam(required = false) String notes) {
        AppointmentResponse appointment = appointmentService.completeAppointment(id, notes);
        return ResponseEntity.ok(ApiResponse.success("Appointment completed successfully", appointment));
    }
}
