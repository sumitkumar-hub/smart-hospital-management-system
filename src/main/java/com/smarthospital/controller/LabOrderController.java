package com.smarthospital.controller;

import com.smarthospital.dto.LabOrderRequestDTO;
import com.smarthospital.dto.LabOrderResponseDTO;
import com.smarthospital.service.LabOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-orders")
public class LabOrderController {

    private final LabOrderService labOrderService;

    public LabOrderController(LabOrderService labOrderService) {
        this.labOrderService = labOrderService;
    }

    // Create Lab Order
    @PostMapping
    public ResponseEntity<LabOrderResponseDTO> createLabOrder(
            @Valid @RequestBody LabOrderRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labOrderService.createLabOrder(requestDTO)
        );
    }

    // Get All Lab Orders
    @GetMapping
    public ResponseEntity<List<LabOrderResponseDTO>> getAllLabOrders() {

        return ResponseEntity.ok(
                labOrderService.getAllLabOrders()
        );
    }

    // Get Lab Order By ID
    @GetMapping("/{id}")
    public ResponseEntity<LabOrderResponseDTO> getLabOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                labOrderService.getLabOrderById(id)
        );
    }

    // Update Lab Order
    @PutMapping("/{id}")
    public ResponseEntity<LabOrderResponseDTO> updateLabOrder(
            @PathVariable Long id,
            @Valid @RequestBody LabOrderRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labOrderService.updateLabOrder(id, requestDTO)
        );
    }

    // Delete Lab Order
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLabOrder(
            @PathVariable Long id) {

        labOrderService.deleteLabOrder(id);

        return ResponseEntity.ok(
                "Lab Order deleted successfully"
        );
    }
}