package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.AppointmentRequestDTO;
import com.smarthospital.dto.AppointmentResponseDTO;
import com.smarthospital.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // ==============================
    // Book Appointment
    // ==============================
    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO request) {

        AppointmentResponseDTO response =
                appointmentService.bookAppointment(request);

        ApiResponse<AppointmentResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointment booked successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Get All Appointments
    // ==============================
    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAllAppointments() {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAllAppointments();

        ApiResponse<List<AppointmentResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Get Appointment By Id
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(
            @PathVariable Long id) {

        AppointmentResponseDTO appointment =
                appointmentService.getAppointmentById(id);

        ApiResponse<AppointmentResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointment fetched successfully",
                        appointment,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Get Appointments By Patient
    // ==============================
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByPatient(
            @PathVariable Long patientId) {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAppointmentsByPatient(patientId);

        ApiResponse<List<AppointmentResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Patient appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Get Appointments By Doctor
    // ==============================
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAppointmentsByDoctor(
            @PathVariable Long doctorId) {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAppointmentsByDoctor(doctorId);

        ApiResponse<List<AppointmentResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "Doctor appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Update Appointment Status
    // ==============================
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        AppointmentResponseDTO response =
                appointmentService.updateAppointmentStatus(id, status);

        ApiResponse<AppointmentResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointment status updated successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Cancel Appointment
    // ==============================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(
            @PathVariable Long id) {

        AppointmentResponseDTO response =
                appointmentService.cancelAppointment(id);

        ApiResponse<AppointmentResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointment cancelled successfully",
                        response,
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }

    // ==============================
    // Delete Appointment
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        ApiResponse<String> apiResponse =
                new ApiResponse<>(
                        true,
                        "Appointment deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                );

        return ResponseEntity.ok(apiResponse);
    }
}