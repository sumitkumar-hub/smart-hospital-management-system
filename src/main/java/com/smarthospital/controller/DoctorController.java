package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.DoctorRequestDTO;
import com.smarthospital.dto.DoctorResponseDTO;
import com.smarthospital.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // =========================
    // ADD DOCTOR
    // ADMIN ONLY
    // =========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> addDoctor(
            @Valid @RequestBody DoctorRequestDTO request) {

        DoctorResponseDTO response =
                doctorService.addDoctor(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor added successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET ALL DOCTORS
    // ADMIN + DOCTOR + RECEPTIONIST + PATIENT
    // =========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAllDoctors() {

        List<DoctorResponseDTO> doctors =
                doctorService.getAllDoctors();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctors fetched successfully",
                        doctors,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET DOCTOR BY ID
    // ADMIN + DOCTOR + RECEPTIONIST + PATIENT
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(
            @PathVariable Long id) {

        DoctorResponseDTO doctor =
                doctorService.getDoctorById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor fetched successfully",
                        doctor,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // UPDATE DOCTOR
    // ADMIN ONLY
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequestDTO request) {

        DoctorResponseDTO doctor =
                doctorService.updateDoctor(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor updated successfully",
                        doctor,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // DELETE DOCTOR
    // ADMIN ONLY
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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

    // =========================
    // SEARCH BY SPECIALIZATION
    // ALL STAFF + PATIENT
    // =========================
    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>>
    getDoctorsBySpecialization(
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

    // =========================
    // GET AVAILABLE DOCTORS
    // ALL STAFF + PATIENT
    // =========================
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>>
    getAvailableDoctors() {

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