package com.smarthospital.controller;

import com.smarthospital.dto.MedicineRequestDTO;
import com.smarthospital.dto.MedicineResponseDTO;
import com.smarthospital.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // Create Medicine
    @PostMapping
    public ResponseEntity<MedicineResponseDTO> createMedicine(
            @Valid @RequestBody MedicineRequestDTO requestDTO) {

        return ResponseEntity.ok(
                medicineService.createMedicine(requestDTO)
        );
    }

    // Get All Medicines
    @GetMapping
    public ResponseEntity<List<MedicineResponseDTO>> getAllMedicines() {

        return ResponseEntity.ok(
                medicineService.getAllMedicines()
        );
    }

    // Get Medicine By ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponseDTO> getMedicineById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(id)
        );
    }

    // Update Medicine
    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponseDTO> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody MedicineRequestDTO requestDTO) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(id, requestDTO)
        );
    }

    // Delete Medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id) {

        medicineService.deleteMedicine(id);

        return ResponseEntity.ok(
                "Medicine deleted successfully"
        );
    }
}