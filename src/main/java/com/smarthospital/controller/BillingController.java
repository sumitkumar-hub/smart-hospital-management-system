package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.BillingRequestDTO;
import com.smarthospital.dto.BillingResponseDTO;
import com.smarthospital.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    // Create Bill
    @PostMapping
    public ResponseEntity<ApiResponse<BillingResponseDTO>> createBill(
            @Valid @RequestBody BillingRequestDTO request) {

        BillingResponseDTO response = billingService.createBill(request);

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bill created successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get All Bills
    @GetMapping
    public ResponseEntity<ApiResponse<List<BillingResponseDTO>>> getAllBills() {

        List<BillingResponseDTO> response =
                billingService.getAllBills();

        ApiResponse<List<BillingResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bills fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Bill By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> getBillById(
            @PathVariable Long id) {

        BillingResponseDTO response =
                billingService.getBillById(id);

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bill fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Get Bills By Patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<BillingResponseDTO>>> getBillsByPatient(
            @PathVariable Long patientId) {

        List<BillingResponseDTO> response =
                billingService.getBillsByPatient(patientId);

        ApiResponse<List<BillingResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Patient bills fetched successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Update Bill
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillingRequestDTO request) {

        BillingResponseDTO response =
                billingService.updateBill(id, request);

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bill updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Update Payment Status
    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String paymentStatus) {

        BillingResponseDTO response =
                billingService.updatePaymentStatus(id, paymentStatus);

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Payment status updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // Delete Bill
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBill(
            @PathVariable Long id) {

        billingService.deleteBill(id);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bill deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }
}