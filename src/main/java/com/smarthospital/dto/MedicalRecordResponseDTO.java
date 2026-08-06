package com.smarthospital.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicalRecordResponseDTO {

    private Long id;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;
    private String specialization;

    private String diagnosis;
    private String prescription;
    private String notes;

    private LocalDate visitDate;
}