package com.smarthospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "billings")
@Getter
@Setter
@NoArgsConstructor
public class Billing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal medicineCharges;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal labCharges;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal otherCharges;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String paymentStatus; // PAID / UNPAID / PARTIAL

    @Column(nullable = false)
    private String paymentMethod; // CASH / CARD / UPI / NETBANKING

    @Column(nullable = false)
    private LocalDate billDate;
}