package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.DoctorRequestDTO;
import com.smarthospital.dto.DoctorResponseDTO;
import com.smarthospital.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // Add Doctor
    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> addDoctor(
            @Valid @RequestBody DoctorRequestDTO request) {

        DoctorResponseDTO response = doctorService.addDoctor(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor added successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // Get All Doctors
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAllDoctors() {

        List<DoctorResponseDTO> doctors = doctorService.getAllDoctors();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctors fetched successfully",
                        doctors,
                        LocalDateTime.now()
                )
        );
    }

    // Get Doctor By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(
            @PathVariable Long id) {

        DoctorResponseDTO doctor = doctorService.getDoctorById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor fetched successfully",
                        doctor,
                        LocalDateTime.now()
                )
        );
    }

    // Update Doctor
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequestDTO request) {

        DoctorResponseDTO doctor = doctorService.updateDoctor(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor updated successfully",
                        doctor,
                        LocalDateTime.now()
                )
        );
    }

    // Delete Doctor
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor deleted successfully",
                        "Doctor deleted.",
                        LocalDateTime.now()
                )
        );
    }

    // Search By Specialization
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getDoctorsBySpecialization(
            @PathVariable String specialization) {

        List<DoctorResponseDTO> doctors =
                doctorService.getDoctorsBySpecialization(specialization);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctors fetched successfully",
                        doctors,
                        LocalDateTime.now()
                )
        );
    }

    // Get Available Doctors
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAvailableDoctors() {

        List<DoctorResponseDTO> doctors =
                doctorService.getAvailableDoctors();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Available doctors fetched successfully",
                        doctors,
                        LocalDateTime.now()
                )
        );
    }
}