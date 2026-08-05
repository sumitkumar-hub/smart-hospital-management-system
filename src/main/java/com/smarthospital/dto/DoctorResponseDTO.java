package com.smarthospital.dto;

import lombok.Data;

@Data
public class DoctorResponseDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String specialization;

    private Integer experience;

    private String qualification;

    private Double consultationFee;

    private Boolean available;
}