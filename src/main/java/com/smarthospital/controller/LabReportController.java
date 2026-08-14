package com.smarthospital.controller;

import com.smarthospital.dto.LabReportRequestDTO;
import com.smarthospital.dto.LabReportResponseDTO;
import com.smarthospital.service.LabReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-reports")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    // Create Lab Report
    @PostMapping
    public ResponseEntity<LabReportResponseDTO> createLabReport(
            @Valid @RequestBody LabReportRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labReportService.createLabReport(requestDTO)
        );
    }

    // Get All Lab Reports
    @GetMapping
    public ResponseEntity<List<LabReportResponseDTO>> getAllLabReports() {

        return ResponseEntity.ok(
                labReportService.getAllLabReports()
        );
    }

    // Get Lab Report By ID
    @GetMapping("/{id}")
    public ResponseEntity<LabReportResponseDTO> getLabReportById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                labReportService.getLabReportById(id)
        );
    }

    // Update Lab Report
    @PutMapping("/{id}")
    public ResponseEntity<LabReportResponseDTO> updateLabReport(
            @PathVariable Long id,
            @Valid @RequestBody LabReportRequestDTO requestDTO) {

        return ResponseEntity.ok(
                labReportService.updateLabReport(id, requestDTO)
        );
    }

    // Delete Lab Report
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLabReport(
            @PathVariable Long id) {

        labReportService.deleteLabReport(id);

        return ResponseEntity.ok(
                "Lab Report deleted successfully"
        );
    }
}