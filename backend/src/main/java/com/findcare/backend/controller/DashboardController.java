package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.DashboardStats;
import com.findcare.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/admin/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStats>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", dashboardService.getAdminDashboardStats()));
    }
}
