package com.smarthospital.repository;

import com.smarthospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByPhone(String phone);

    List<Patient> findByFirstNameContainingIgnoreCase(String firstName);

}