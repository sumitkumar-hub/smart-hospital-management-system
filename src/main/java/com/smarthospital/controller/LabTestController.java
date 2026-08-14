package com.smarthospital.controller;

import com.smarthospital.dto.LabTestRequestDTO;
import com.smarthospital.dto.LabTestResponseDTO;
import com.smarthospital.service.LabTestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
public class LabTestController {

    @Autowired
    private LabTestService labTestService;

    // Create Lab Test
    @PostMapping
    public ResponseEntity<LabTestResponseDTO> createLabTest(
            @Valid @RequestBody LabTestRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labTestService.createLabTest(requestDTO)
        );
    }

    // Get All Lab Tests
    @GetMapping
    public ResponseEntity<List<LabTestResponseDTO>> getAllLabTests() {

        return ResponseEntity.ok(
                labTestService.getAllLabTests()
        );
    }

    // Get Lab Test By ID
    @GetMapping("/{id}")
    public ResponseEntity<LabTestResponseDTO> getLabTestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                labTestService.getLabTestById(id)
        );
    }

    // Update Lab Test
    @PutMapping("/{id}")
    public ResponseEntity<LabTestResponseDTO> updateLabTest(
            @PathVariable Long id,
            @Valid @RequestBody LabTestRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labTestService.updateLabTest(id, requestDTO)
        );
    }

    // Delete Lab Test
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLabTest(
            @PathVariable Long id) {

        labTestService.deleteLabTest(id);
        return ResponseEntity.ok("Lab Test Deleted Successfully");
    }
}