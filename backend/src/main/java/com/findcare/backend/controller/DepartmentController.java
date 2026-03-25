package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.DepartmentResponse;
import com.findcare.backend.dto.DepartmentRequest;
import com.findcare.backend.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departmentService.getAllDepartments()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", departmentService.getDepartmentById(id)));
    }
    
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartmentsByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Departments by hospital retrieved successfully",
                departmentService.getDepartmentsByHospital(hospitalId)
        ));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse savedDepartment = departmentService.createDepartment(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Department created successfully", savedDepartment));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse updatedDepartment = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updatedDepartment));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
