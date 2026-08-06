package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.MedicalRecordRequestDTO;
import com.smarthospital.dto.MedicalRecordResponseDTO;
import com.smarthospital.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    // Add Medical Record
    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>> addMedicalRecord(
            @Valid @RequestBody MedicalRecordRequestDTO request) {

        MedicalRecordResponseDTO response =
                medicalRecordService.addMedicalRecord(request);

        ApiResponse<MedicalRecordResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Medical record added successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get All Medical Records
    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDTO>>> getAllMedicalRecords() {

        List<MedicalRecordResponseDTO> response =
                medicalRecordService.getAllMedicalRecords();

        ApiResponse<List<MedicalRecordResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Medical records fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Medical Record By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>> getMedicalRecordById(
            @PathVariable Long id) {

        MedicalRecordResponseDTO response =
                medicalRecordService.getMedicalRecordById(id);

        ApiResponse<MedicalRecordResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Medical record fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Medical Records By Patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDTO>>> getMedicalRecordsByPatient(
            @PathVariable Long patientId) {

        List<MedicalRecordResponseDTO> response =
                medicalRecordService.getMedicalRecordsByPatient(patientId);

        ApiResponse<List<MedicalRecordResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Patient medical records fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Update Medical Record
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDTO>> updateMedicalRecord(
            @PathVariable Long id,
            @Valid @RequestBody MedicalRecordRequestDTO request) {

        MedicalRecordResponseDTO response =
                medicalRecordService.updateMedicalRecord(id, request);

        ApiResponse<MedicalRecordResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Medical record updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Delete Medical Record
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMedicalRecord(
            @PathVariable Long id) {

        medicalRecordService.deleteMedicalRecord(id);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(
                        true,
                        "Medical record deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }
}