package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.HospitalRequest;
import com.findcare.backend.dto.HospitalResponse;
import com.findcare.backend.dto.PagedResponse;
import com.findcare.backend.entity.HospitalType;
import com.findcare.backend.service.HospitalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    
    private final HospitalService hospitalService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HospitalResponse>>> getAllHospitals(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Hospitals retrieved successfully",
                PagedResponse.from(hospitalService.getAllHospitals(pageable))
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalResponse>> getHospitalById(@PathVariable Long id) {
        HospitalResponse hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(ApiResponse.success("Hospital retrieved successfully", hospital));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<HospitalResponse>>> searchHospitals(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Hospital search completed",
                PagedResponse.from(hospitalService.searchHospitals(keyword, pageable))
        ));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<PagedResponse<HospitalResponse>>> getHospitalsByType(
            @PathVariable HospitalType type,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Hospitals by type retrieved successfully",
                PagedResponse.from(hospitalService.getHospitalsByType(type, pageable))
        ));
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<PagedResponse<HospitalResponse>>> getHospitalsByCity(
            @PathVariable String city,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Hospitals by city retrieved successfully",
                PagedResponse.from(hospitalService.getHospitalsByCity(city, pageable))
        ));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<HospitalResponse>> createHospital(@Valid @RequestBody HospitalRequest request) {
        HospitalResponse hospital = hospitalService.createHospital(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Hospital created successfully", hospital));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<HospitalResponse>> updateHospital(@PathVariable Long id, @Valid @RequestBody HospitalRequest request) {
        HospitalResponse hospital = hospitalService.updateHospital(id, request);
        return ResponseEntity.ok(ApiResponse.success("Hospital updated successfully", hospital));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }
}
