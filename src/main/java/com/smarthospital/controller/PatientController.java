package com.smarthospital.controller;

import com.smarthospital.dto.PatientRequestDTO;
import com.smarthospital.dto.PatientResponseDTO;
import com.smarthospital.service.PatientService;
import com.smarthospital.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // =========================
    // ADD PATIENT
    // ADMIN + RECEPTIONIST
    // =========================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponseDTO> addPatient(
            @Valid @RequestBody PatientRequestDTO request) {

        PatientResponseDTO response =
                patientService.addPatient(request);

        return new ApiResponse<>(
                true,
                "Patient added successfully",
                response
        );
    }

    // =========================
    // GET ALL PATIENTS
    // ADMIN + DOCTOR + RECEPTIONIST
    // =========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ApiResponse<List<PatientResponseDTO>> getAllPatients() {

        List<PatientResponseDTO> patients =
                patientService.getAllPatients();

        return new ApiResponse<>(
                true,
                "Patients fetched successfully",
                patients
        );
    }

    // =========================
    // GET PATIENT BY ID
    // ADMIN + DOCTOR + PATIENT
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ApiResponse<PatientResponseDTO> getPatientById(
            @PathVariable Long id) {

        PatientResponseDTO patient =
                patientService.getPatientById(id);

        return new ApiResponse<>(
                true,
                "Patient fetched successfully",
                patient
        );
    }

    // =========================
    // UPDATE PATIENT
    // ADMIN + RECEPTIONIST
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ApiResponse<PatientResponseDTO> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequestDTO request) {

        PatientResponseDTO response =
                patientService.updatePatient(id, request);

        return new ApiResponse<>(
                true,
                "Patient updated successfully",
                response
        );
    }
}