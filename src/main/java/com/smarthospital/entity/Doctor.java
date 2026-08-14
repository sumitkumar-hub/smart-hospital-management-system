package com.smarthospital.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Collection;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private Integer experience;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private Double consultationFee;

    @Column(nullable = false)
    private Boolean available = true;
    @OneToMany(mappedBy = "doctor")
    private Collection<LabOrder> labOrder;

    public Collection<LabOrder> getLabOrder() {
        return labOrder;
    }

    public void setLabOrder(Collection<LabOrder> labOrder) {
        this.labOrder = labOrder;
    }
}