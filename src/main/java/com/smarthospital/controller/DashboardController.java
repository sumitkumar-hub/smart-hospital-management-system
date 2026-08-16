package com.smarthospital.controller;

import com.smarthospital.dto.DashboardResponseDTO;
import com.smarthospital.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // =========================
    // GET HOSPITAL DASHBOARD
    // =========================
    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard()
        );
    }
}