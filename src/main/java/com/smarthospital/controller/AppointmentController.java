package com.smarthospital.controller;

import com.smarthospital.dto.ApiResponse;
import com.smarthospital.dto.AppointmentRequestDTO;
import com.smarthospital.dto.AppointmentResponseDTO;
import com.smarthospital.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // ==============================
    // BOOK APPOINTMENT
    // ADMIN + PATIENT + RECEPTIONIST
    // ==============================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO request) {

        AppointmentResponseDTO response =
                appointmentService.bookAppointment(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointment booked successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET ALL APPOINTMENTS
    // ADMIN + DOCTOR + RECEPTIONIST
    // ==============================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAllAppointments() {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET APPOINTMENT BY ID
    // ADMIN + DOCTOR + RECEPTIONIST + PATIENT
    // ==============================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(
            @PathVariable Long id) {

        AppointmentResponseDTO appointment =
                appointmentService.getAppointmentById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointment fetched successfully",
                        appointment,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET APPOINTMENTS BY PATIENT
    // ADMIN + RECEPTIONIST + PATIENT
    // ==============================
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>>
    getAppointmentsByPatient(
            @PathVariable Long patientId) {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAppointmentsByPatient(patientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // GET APPOINTMENTS BY DOCTOR
    // ADMIN + DOCTOR + RECEPTIONIST
    // ==============================
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>>
    getAppointmentsByDoctor(
            @PathVariable Long doctorId) {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAppointmentsByDoctor(doctorId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor appointments fetched successfully",
                        appointments,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // UPDATE APPOINTMENT STATUS
    // ADMIN + DOCTOR
    // ==============================
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>>
    updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        AppointmentResponseDTO response =
                appointmentService.updateAppointmentStatus(id, status);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointment status updated successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // CANCEL APPOINTMENT
    // ADMIN + PATIENT + RECEPTIONIST
    // ==============================
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(
            @PathVariable Long id) {

        AppointmentResponseDTO response =
                appointmentService.cancelAppointment(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointment cancelled successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // ==============================
    // DELETE APPOINTMENT
    // ADMIN ONLY
    // ==============================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Appointment deleted successfully",
                        "Deleted",
                        LocalDateTime.now()
                )
        );
    }
}