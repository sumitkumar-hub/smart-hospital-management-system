package com.smarthospital.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentResponseDTO {

    private Long id;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;
    private String specialization;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String reason;

    private String status;
}