package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.TimeSlotRequest;
import com.findcare.backend.entity.TimeSlot;
import com.findcare.backend.service.TimeSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {
    
    private final TimeSlotService timeSlotService;
    
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<TimeSlot>> createTimeSlot(@Valid @RequestBody TimeSlotRequest request) {
        TimeSlot timeSlot = timeSlotService.createTimeSlot(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Time slot created successfully", timeSlot));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<TimeSlot>>> getDoctorTimeSlots(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success("Doctor time slots retrieved successfully", timeSlotService.getDoctorTimeSlots(doctorId)));
    }
    
    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<ApiResponse<List<TimeSlot>>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success("Available time slots retrieved successfully", timeSlotService.getAvailableSlots(doctorId, date)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.noContent().build();
    }
}
