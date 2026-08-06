package com.smarthospital.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillingResponseDTO {

    private Long id;

    private Long patientId;
    private String patientName;

    private BigDecimal consultationFee;
    private BigDecimal medicineCharges;
    private BigDecimal labCharges;
    private BigDecimal otherCharges;
    private BigDecimal totalAmount;

    private String paymentStatus;
    private String paymentMethod;

    private LocalDate billDate;
}