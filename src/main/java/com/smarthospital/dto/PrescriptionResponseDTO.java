package com.smarthospital.dto;

import lombok.Data;

@Data
public class PrescriptionResponseDTO {

    private Long id;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;

    private Long medicalRecordId;

    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
}