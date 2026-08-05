package com.smarthospital.repository;

import com.smarthospital.entity.Appointment;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Check Doctor Availability
    boolean existsByDoctorAndAppointmentDateAndAppointmentTime(
            Doctor doctor,
            LocalDate appointmentDate,
            LocalTime appointmentTime
    );

    // Get All Appointments of a Patient
    List<Appointment> findByPatient(Patient patient);

    // Get All Appointments of a Doctor
    List<Appointment> findByDoctor(Doctor doctor);

    // Get Appointments by Status
    List<Appointment> findByStatus(String status);

}