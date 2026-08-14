package com.smarthospital.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LabReportResponseDTO {

    private Long id;

    private String patientName;

    private String doctorName;

    private String labTestName;

    private String result;

    private String remarks;

    private LocalDate reportDate;
}