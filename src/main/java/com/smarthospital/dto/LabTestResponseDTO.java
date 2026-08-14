package com.smarthospital.dto;

import lombok.Data;

@Data
public class LabTestResponseDTO {

    private Long id;

    private String testName;

    private String category;

    private Double price;

    private String normalRange;

    private String description;
}