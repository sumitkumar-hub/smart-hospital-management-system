package com.smarthospital.repository;

import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.MedicalRecord;
import com.smarthospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    // Get all medical records of a patient
    List<MedicalRecord> findByPatient(Patient patient);

    // Get all medical records created by a doctor
    List<MedicalRecord> findByDoctor(Doctor doctor);

    // Get all records of a patient ordered by latest visit
    List<MedicalRecord> findByPatientOrderByVisitDateDesc(Patient patient);
}