package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.DoctorRequest;
import com.findcare.backend.dto.DoctorResponse;
import com.findcare.backend.dto.PagedResponse;
import com.findcare.backend.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    
    private final DoctorService doctorService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DoctorResponse>>> getAllDoctors(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Doctors retrieved successfully",
                PagedResponse.from(doctorService.getAllDoctors(pageable))
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor retrieved successfully", doctor));
    }
    
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorResponse>>> getDoctorsByHospital(
            @PathVariable Long hospitalId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Doctors by hospital retrieved successfully",
                PagedResponse.from(doctorService.getDoctorsByHospital(hospitalId, pageable))
        ));
    }
    
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorResponse>>> getDoctorsByDepartment(
            @PathVariable Long departmentId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Doctors by department retrieved successfully",
                PagedResponse.from(doctorService.getDoctorsByDepartment(departmentId, pageable))
        ));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorResponse>>> searchDoctors(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Doctor search completed",
                PagedResponse.from(doctorService.searchDoctors(keyword, pageable))
        ));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@Valid @RequestBody DoctorRequest request) {
        DoctorResponse doctor = doctorService.createDoctor(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Doctor created successfully", doctor));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest request) {
        DoctorResponse doctor = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", doctor));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
