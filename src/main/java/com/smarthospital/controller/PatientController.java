package com.smarthospital.controller;

import com.smarthospital.dto.PatientRequestDTO;
import com.smarthospital.dto.PatientResponseDTO;
import com.smarthospital.service.PatientService;
import com.smarthospital.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // Add Patient
    @PostMapping
    public ApiResponse<PatientResponseDTO> addPatient(
            @Valid @RequestBody PatientRequestDTO request) {

        PatientResponseDTO response = patientService.addPatient(request);

        return new ApiResponse<>(
                true,
                "Patient added successfully",
                response
        );
    }

    // Get All Patients
    @GetMapping
    public ApiResponse<List<PatientResponseDTO>> getAllPatients() {

        List<PatientResponseDTO> patients = patientService.getAllPatients();

        return new ApiResponse<>(
                true,
                "Patients fetched successfully",
                patients
        );
    }

    // Get Patient By ID
    @GetMapping("/{id}")
    public ApiResponse<PatientResponseDTO> getPatientById(
            @PathVariable Long id) {

        PatientResponseDTO patient = patientService.getPatientById(id);

        return new ApiResponse<>(
                true,
                "Patient fetched successfully",
                patient
        );
    }

    // Update Patient
    @PutMapping("/{id}")
    public ApiResponse<PatientResponseDTO> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequestDTO request) {

        PatientResponseDTO response = patientService.updatePatient(id, request);

        return new ApiResponse<>(
                true,
                "Patient updated successfully",
                response
        );
    }
}