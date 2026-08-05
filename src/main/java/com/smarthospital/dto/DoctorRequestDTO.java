package com.smarthospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DoctorRequestDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotNull(message = "Consultation fee is required")
    @Positive(message = "Consultation fee must be greater than 0")
    private Double consultationFee;

    private Boolean available = true;
}