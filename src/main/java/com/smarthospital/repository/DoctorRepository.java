package com.smarthospital.repository;

import com.smarthospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // Find doctor by email
    Optional<Doctor> findByEmail(String email);

    // Find doctors by specialization
    List<Doctor> findBySpecialization(String specialization);

    // Find available doctors
    List<Doctor> findByAvailableTrue();

    // Find available doctors by specialization
    List<Doctor> findBySpecializationAndAvailableTrue(String specialization);
}