package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.PrescriptionRequestDTO;
import com.smarthospital.dto.PrescriptionResponseDTO;
import com.smarthospital.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    // Add Prescription
    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> addPrescription(
            @Valid @RequestBody PrescriptionRequestDTO request) {

        PrescriptionResponseDTO response =
                prescriptionService.addPrescription(request);

        ApiResponse<PrescriptionResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Prescription added successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get All Prescriptions
    @GetMapping
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getAllPrescriptions() {

        List<PrescriptionResponseDTO> response =
                prescriptionService.getAllPrescriptions();

        ApiResponse<List<PrescriptionResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Prescriptions fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Prescription By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionById(
            @PathVariable Long id) {

        PrescriptionResponseDTO response =
                prescriptionService.getPrescriptionById(id);

        ApiResponse<PrescriptionResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Prescription fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Prescriptions By Patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPrescriptionsByPatient(
            @PathVariable Long patientId) {

        List<PrescriptionResponseDTO> response =
                prescriptionService.getPrescriptionsByPatient(patientId);

        ApiResponse<List<PrescriptionResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Patient prescriptions fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Update Prescription
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequestDTO request) {

        PrescriptionResponseDTO response =
                prescriptionService.updatePrescription(id, request);

        ApiResponse<PrescriptionResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Prescription updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Delete Prescription
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePrescription(
            @PathVariable Long id) {

        prescriptionService.deletePrescription(id);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(
                        true,
                        "Prescription deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }
}