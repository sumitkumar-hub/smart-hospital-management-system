package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.StaffRequestDTO;
import com.smarthospital.dto.UserResponseDTO;
import com.smarthospital.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;


    // =========================================================
    // CREATE STAFF ACCOUNT
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createStaff(
            @Valid @RequestBody StaffRequestDTO request) {


        UserResponseDTO response =
                staffService.createStaff(request);


        ApiResponse<UserResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Staff account created successfully",
                        response,
                        LocalDateTime.now()
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }
}