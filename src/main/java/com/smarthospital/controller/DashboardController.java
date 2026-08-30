package com.smarthospital.controller;

import com.smarthospital.dto.ChartDataDTO;
import com.smarthospital.dto.DashboardResponseDTO;
import com.smarthospital.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    // =========================
    // APPOINTMENT STATUS CHART
    // =========================
    @GetMapping("/appointments/chart")
    public ResponseEntity<List<ChartDataDTO>>
    getAppointmentStatusChart() {

        return ResponseEntity.ok(
                dashboardService.getAppointmentStatusChart()
        );
    }


    // =========================
    // LAB ORDER STATUS CHART
    // =========================
    @GetMapping("/lab-orders/chart")
    public ResponseEntity<List<ChartDataDTO>>
    getLabOrderStatusChart() {

        return ResponseEntity.ok(
                dashboardService.getLabOrderStatusChart()
        );
    }


    // =========================
    // PHARMACY STOCK CHART
    // =========================
    @GetMapping("/pharmacy/chart")
    public ResponseEntity<List<ChartDataDTO>>
    getPharmacyStockChart() {

        return ResponseEntity.ok(
                dashboardService.getPharmacyStockChart()
        );
    }
}