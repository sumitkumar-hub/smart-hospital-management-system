package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.LoginRequestDTO;
import com.smarthospital.dto.LoginResponseDTO;
import com.smarthospital.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authService.login(request);

        ApiResponse<LoginResponseDTO> apiResponse = new ApiResponse<>(
                true,
                "Login successful",
                response,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(apiResponse);
    }
}