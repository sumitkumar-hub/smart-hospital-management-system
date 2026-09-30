package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.BillingRequestDTO;
import com.smarthospital.dto.BillingResponseDTO;
import com.smarthospital.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;


    // =========================================================
    // CREATE BILL
    // =========================================================

    @PostMapping
    public ResponseEntity<ApiResponse<BillingResponseDTO>> createBill(
            @Valid @RequestBody BillingRequestDTO request
    ) {

        BillingResponseDTO response =
                billingService.createBill(request);

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Bill created successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }


    // =========================================================
    // GET ALL BILLS
    // =========================================================

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


    // =========================================================
    // GET BILL BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> getBillById(
            @PathVariable Long id
    ) {

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


    // =========================================================
    // GET BILLS BY PATIENT
    // =========================================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<BillingResponseDTO>>> getBillsByPatient(
            @PathVariable Long patientId
    ) {

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


    // =========================================================
    // UPDATE BILL
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillingRequestDTO request
    ) {

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


    // =========================================================
    // UPDATE PAYMENT
    // =========================================================

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<ApiResponse<BillingResponseDTO>> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String paymentStatus,
            @RequestParam(required = false) BigDecimal amountPaid
    ) {

        BillingResponseDTO response =
                billingService.updatePaymentStatus(
                        id,
                        paymentStatus,
                        amountPaid
                );

        ApiResponse<BillingResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Payment details updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }


    // =========================================================
    // DELETE BILL
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBill(
            @PathVariable Long id
    ) {

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