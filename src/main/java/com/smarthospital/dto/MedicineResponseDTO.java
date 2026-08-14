package com.smarthospital.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MedicineResponseDTO {

    private Long id;

    private String name;

    private String genericName;

    private String category;

    private String manufacturer;

    private BigDecimal price;

    private Integer stockQuantity;

    private LocalDate expiryDate;

    private String description;

    private Boolean active;
}
