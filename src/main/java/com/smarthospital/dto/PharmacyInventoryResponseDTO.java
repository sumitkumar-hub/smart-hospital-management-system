package com.smarthospital.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PharmacyInventoryResponseDTO {

    private Long id;

    private Long medicineId;

    private String medicineName;

    private Integer quantity;

    private Integer minimumStockLevel;

    private String batchNumber;

    private LocalDate expiryDate;

    private LocalDate receivedDate;

    private boolean lowStock;

    private boolean expired;
}