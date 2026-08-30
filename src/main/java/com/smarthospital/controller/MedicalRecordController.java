package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.MedicalRecordRequestDTO;
import com.smarthospital.dto.MedicalRecordResponseDTO;
import com.smarthospital.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    // ==============================
    // ADD MEDICAL RECORD
    // ADMIN + DOCTOR
    // ==============================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>> addMedicalRecord(
            @Valid @RequestBody MedicalRecordRequestDTO request) {

        MedicalRecordResponseDTO response =
                medicalRecordService.addMedicalRecord(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record added successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET ALL MEDICAL RECORDS
    // ADMIN + DOCTOR
    // ==============================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDTO>>>
    getAllMedicalRecords() {

        List<MedicalRecordResponseDTO> response =
                medicalRecordService.getAllMedicalRecords();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical records fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET MEDICAL RECORD BY ID
    // ADMIN + DOCTOR + PATIENT
    // ==============================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>>
    getMedicalRecordById(
            @PathVariable Long id) {

        MedicalRecordResponseDTO response =
                medicalRecordService.getMedicalRecordById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET MEDICAL RECORDS BY PATIENT
    // ADMIN + DOCTOR + PATIENT
    // ==============================
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDTO>>>
    getMedicalRecordsByPatient(
            @PathVariable Long patientId) {

        List<MedicalRecordResponseDTO> response =
                medicalRecordService.getMedicalRecordsByPatient(patientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient medical records fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // UPDATE MEDICAL RECORD
    // ADMIN + DOCTOR
    // ==============================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>>
    updateMedicalRecord(
            @PathVariable Long id,
            @Valid @RequestBody MedicalRecordRequestDTO request) {

        MedicalRecordResponseDTO response =
                medicalRecordService.updateMedicalRecord(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record updated successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // DELETE MEDICAL RECORD
    // ADMIN ONLY
    // ==============================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteMedicalRecord(
            @PathVariable Long id) {

        medicalRecordService.deleteMedicalRecord(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                )
        );
    }
}