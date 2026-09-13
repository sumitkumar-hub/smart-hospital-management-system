package com.smarthospital.controller;

import com.smarthospital.dto.LoginRequestDTO;
import com.smarthospital.dto.LoginResponseDTO;
import com.smarthospital.dto.RegisterRequestDTO;
import com.smarthospital.entity.Patient;
import com.smarthospital.service.AuthService;
import com.smarthospital.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    // ==========================
    // Login API
    // ==========================

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response =
                authService.login(request);

        ApiResponse<LoginResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Login successful",
                        response
                );

        return ResponseEntity.ok(apiResponse);
    }


    // ==========================
    // Register API
    // ==========================

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        authService.register(request);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(
                        true,
                        "Registration successful",
                        "Patient account created successfully"
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }


    // ==========================
    // Test API
    // ==========================

    @GetMapping("/test")
    public ResponseEntity<String> test() {

        return ResponseEntity.ok("Working");
    }
}