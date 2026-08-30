package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.PrescriptionRequestDTO;
import com.smarthospital.dto.PrescriptionResponseDTO;
import com.smarthospital.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    // ==============================
    // ADD PRESCRIPTION
    // ADMIN + DOCTOR
    // ==============================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> addPrescription(
            @Valid @RequestBody PrescriptionRequestDTO request) {

        PrescriptionResponseDTO response =
                prescriptionService.addPrescription(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Prescription added successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET ALL PRESCRIPTIONS
    // ADMIN + DOCTOR + PHARMACIST
    // ==============================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>>
    getAllPrescriptions() {

        List<PrescriptionResponseDTO> response =
                prescriptionService.getAllPrescriptions();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Prescriptions fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET PRESCRIPTION BY ID
    // ADMIN + DOCTOR + PATIENT + PHARMACIST
    // ==============================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>>
    getPrescriptionById(
            @PathVariable Long id) {

        PrescriptionResponseDTO response =
                prescriptionService.getPrescriptionById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Prescription fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET PRESCRIPTIONS BY PATIENT
    // ADMIN + DOCTOR + PATIENT + PHARMACIST
    // ==============================
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>>
    getPrescriptionsByPatient(
            @PathVariable Long patientId) {

        List<PrescriptionResponseDTO> response =
                prescriptionService.getPrescriptionsByPatient(patientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient prescriptions fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // UPDATE PRESCRIPTION
    // ADMIN + DOCTOR
    // ==============================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>>
    updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequestDTO request) {

        PrescriptionResponseDTO response =
                prescriptionService.updatePrescription(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Prescription updated successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // DELETE PRESCRIPTION
    // ADMIN ONLY
    // ==============================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePrescription(
            @PathVariable Long id) {

        prescriptionService.deletePrescription(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Prescription deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                )
        );
    }
}