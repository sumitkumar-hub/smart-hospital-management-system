package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.RegisterRequestDTO;
import com.smarthospital.dto.UserResponseDTO;
import com.smarthospital.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(
            @Valid @RequestBody RegisterRequestDTO request) {

        UserResponseDTO response = userService.registerUser(request);

        ApiResponse<UserResponseDTO> apiResponse = new ApiResponse<>(
                true,
                "User registered successfully",
                response,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(apiResponse);
    }
}