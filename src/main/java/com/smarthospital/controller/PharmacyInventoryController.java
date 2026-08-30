package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.PharmacyInventoryRequestDTO;
import com.smarthospital.dto.PharmacyInventoryResponseDTO;
import com.smarthospital.service.PharmacyInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pharmacy-inventory")
public class PharmacyInventoryController {

    @Autowired
    private PharmacyInventoryService pharmacyInventoryService;

    // =========================
    // ADD INVENTORY
    // =========================
    @PostMapping
    public ResponseEntity<ApiResponse<PharmacyInventoryResponseDTO>> addInventory(
            @Valid @RequestBody PharmacyInventoryRequestDTO request) {

        PharmacyInventoryResponseDTO response =
                pharmacyInventoryService.addInventory(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Inventory added successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET ALL INVENTORY
    // =========================
    @GetMapping
    public ResponseEntity<ApiResponse<List<PharmacyInventoryResponseDTO>>>
    getAllInventory() {

        List<PharmacyInventoryResponseDTO> response =
                pharmacyInventoryService.getAllInventory();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Inventory fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET INVENTORY BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PharmacyInventoryResponseDTO>>
    getInventoryById(@PathVariable Long id) {

        PharmacyInventoryResponseDTO response =
                pharmacyInventoryService.getInventoryById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Inventory fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET INVENTORY BY MEDICINE
    // =========================
    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<ApiResponse<List<PharmacyInventoryResponseDTO>>>
    getInventoryByMedicine(@PathVariable Long medicineId) {

        List<PharmacyInventoryResponseDTO> response =
                pharmacyInventoryService.getInventoryByMedicine(medicineId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medicine inventory fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // UPDATE INVENTORY
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PharmacyInventoryResponseDTO>>
    updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody PharmacyInventoryRequestDTO request) {

        PharmacyInventoryResponseDTO response =
                pharmacyInventoryService.updateInventory(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Inventory updated successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // DELETE INVENTORY
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>>
    deleteInventory(@PathVariable Long id) {

        pharmacyInventoryService.deleteInventory(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Inventory deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // LOW STOCK
    // =========================
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<PharmacyInventoryResponseDTO>>>
    getLowStockInventory() {

        List<PharmacyInventoryResponseDTO> response =
                pharmacyInventoryService.getLowStockInventory();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Low stock inventory fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // =========================
    // EXPIRED MEDICINES
    // =========================
    @GetMapping("/expired")
    public ResponseEntity<ApiResponse<List<PharmacyInventoryResponseDTO>>>
    getExpiredInventory() {

        List<PharmacyInventoryResponseDTO> response =
                pharmacyInventoryService.getExpiredInventory();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Expired inventory fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }
}