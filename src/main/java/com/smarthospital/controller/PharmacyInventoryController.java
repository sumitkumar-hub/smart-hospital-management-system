package com.smarthospital.controller;

import com.smarthospital.dto.PharmacyInventoryRequestDTO;
import com.smarthospital.dto.PharmacyInventoryResponseDTO;
import com.smarthospital.service.PharmacyInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<PharmacyInventoryResponseDTO> addInventory(
            @Valid @RequestBody PharmacyInventoryRequestDTO request) {

        return ResponseEntity.ok(
                pharmacyInventoryService.addInventory(request)
        );
    }

    // =========================
    // GET ALL INVENTORY
    // =========================
    @GetMapping
    public ResponseEntity<List<PharmacyInventoryResponseDTO>>
    getAllInventory() {

        return ResponseEntity.ok(
                pharmacyInventoryService.getAllInventory()
        );
    }

    // =========================
    // GET INVENTORY BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<PharmacyInventoryResponseDTO>
    getInventoryById(@PathVariable Long id) {

        return ResponseEntity.ok(
                pharmacyInventoryService.getInventoryById(id)
        );
    }

    // =========================
    // GET INVENTORY BY MEDICINE
    // =========================
    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<PharmacyInventoryResponseDTO>>
    getInventoryByMedicine(@PathVariable Long medicineId) {

        return ResponseEntity.ok(
                pharmacyInventoryService.getInventoryByMedicine(medicineId)
        );
    }

    // =========================
    // UPDATE INVENTORY
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<PharmacyInventoryResponseDTO>
    updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody PharmacyInventoryRequestDTO request) {

        return ResponseEntity.ok(
                pharmacyInventoryService.updateInventory(id, request)
        );
    }

    // =========================
    // DELETE INVENTORY
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(
            @PathVariable Long id) {

        pharmacyInventoryService.deleteInventory(id);

        return ResponseEntity.ok(
                "Inventory deleted successfully"
        );
    }

    // =========================
    // LOW STOCK
    // =========================
    @GetMapping("/low-stock")
    public ResponseEntity<List<PharmacyInventoryResponseDTO>>
    getLowStockInventory() {

        return ResponseEntity.ok(
                pharmacyInventoryService.getLowStockInventory()
        );
    }

    // =========================
    // EXPIRED MEDICINES
    // =========================
    @GetMapping("/expired")
    public ResponseEntity<List<PharmacyInventoryResponseDTO>>
    getExpiredInventory() {

        return ResponseEntity.ok(
                pharmacyInventoryService.getExpiredInventory()
        );
    }
}