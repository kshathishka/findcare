package com.findcare.backend.controller;

import com.findcare.backend.dto.ApiResponse;
import com.findcare.backend.dto.AuthResponse;
import com.findcare.backend.dto.LoginRequest;
import com.findcare.backend.dto.SignupRequest;
import com.findcare.backend.exception.TooManyRequestsException;
import com.findcare.backend.security.LoginRateLimiter;
import com.findcare.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final LoginRateLimiter loginRateLimiter;
    
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        AuthResponse response = authService.register(signupRequest);
        return ResponseEntity.status(201)
                .body(ApiResponse.success("User registered successfully", response));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        String clientKey = resolveClientKey(request);
        if (!loginRateLimiter.isAllowed(clientKey)) {
            throw new TooManyRequestsException("Too many login attempts. Please retry later.");
        }

        try {
            AuthResponse response = authService.login(loginRequest);
            loginRateLimiter.recordSuccess(clientKey);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (BadCredentialsException ex) {
            loginRateLimiter.recordFailure(clientKey);
            throw ex;
        }
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
