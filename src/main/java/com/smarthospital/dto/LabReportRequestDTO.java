package com.smarthospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LabReportRequestDTO {

    @NotNull(message = "Lab Order ID is required")
    private Long labOrderId;

    @NotBlank(message = "Result is required")
    private String result;

    private String remarks;
}