package com.smarthospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "pharmacy_inventory")
@Getter
@Setter
@NoArgsConstructor
public class PharmacyInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Medicine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    // Available quantity
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private Integer quantity;

    // Minimum quantity before stock becomes low
    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Minimum stock level cannot be negative")
    @Column(nullable = false)
    private Integer minimumStockLevel;

    // Medicine batch number
    @Column(length = 100)
    private String batchNumber;

    // Medicine expiry date
    private LocalDate expiryDate;

    // Date when stock was received
    private LocalDate receivedDate;
}