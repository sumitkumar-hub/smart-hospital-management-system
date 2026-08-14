package com.smarthospital.dto;

import lombok.Data;

@Data
public class LabTestRequestDTO {

    private String testName;

    private String category;

    private Double price;

    private String normalRange;

    private String description;
}