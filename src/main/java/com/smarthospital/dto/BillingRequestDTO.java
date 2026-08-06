package com.smarthospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillingRequestDTO {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Consultation fee is required")
    private BigDecimal consultationFee;

    @NotNull(message = "Medicine charges are required")
    private BigDecimal medicineCharges;

    @NotNull(message = "Lab charges are required")
    private BigDecimal labCharges;

    @NotNull(message = "Other charges are required")
    private BigDecimal otherCharges;

    @NotBlank(message = "Payment status is required")
    private String paymentStatus;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotNull(message = "Bill date is required")
    private LocalDate billDate;
}