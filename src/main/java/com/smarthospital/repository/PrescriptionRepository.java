package com.smarthospital.repository;

import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.Patient;
import com.smarthospital.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Get all prescriptions of a patient
    List<Prescription> findByPatient(Patient patient);

    // Get all prescriptions created by a doctor
    List<Prescription> findByDoctor(Doctor doctor);

    // Get latest prescriptions of a patient
    List<Prescription> findByPatientOrderByIdDesc(Patient patient);
    List<Prescription> findByPatientId(Long patientId);
}