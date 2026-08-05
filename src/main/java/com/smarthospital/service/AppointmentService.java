package com.smarthospital.service;

import com.smarthospital.dto.AppointmentRequestDTO;
import com.smarthospital.dto.AppointmentResponseDTO;
import com.smarthospital.entity.Appointment;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.Patient;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.AppointmentRepository;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // ==============================
    // Book Appointment
    // ==============================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        boolean alreadyBooked =
                appointmentRepository.existsByDoctorAndAppointmentDateAndAppointmentTime(
                        doctor,
                        request.getAppointmentDate(),
                        request.getAppointmentTime()
                );

        if (alreadyBooked) {
            throw new RuntimeException("Doctor is already booked for this date and time.");
        }

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus("BOOKED");

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return convertToResponse(savedAppointment);
    }

    // ==============================
    // Get All Appointments
    // ==============================
    public List<AppointmentResponseDTO> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==============================
    // Get Appointment By Id
    // ==============================
    public AppointmentResponseDTO getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        return convertToResponse(appointment);
    }

    // ==============================
    // Get Appointments By Patient
    // ==============================
    public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==============================
    // Get Appointments By Doctor
    // ==============================
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==============================
    // Update Appointment Status
    // ==============================
    public AppointmentResponseDTO updateAppointmentStatus(Long id, String status) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(status);

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    // ==============================
    // Cancel Appointment
    // ==============================
    public AppointmentResponseDTO cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus("CANCELLED");

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    // ==============================
    // Delete Appointment
    // ==============================
    public void deleteAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointmentRepository.delete(appointment);
    }

    // ==============================
    // Entity -> DTO
    // ==============================
    private AppointmentResponseDTO convertToResponse(Appointment appointment) {

        AppointmentResponseDTO response = new AppointmentResponseDTO();

        response.setId(appointment.getId());

        response.setPatientId(appointment.getPatient().getId());
        response.setPatientName(
                appointment.getPatient().getFirstName() + " " +
                        appointment.getPatient().getLastName()
        );

        response.setDoctorId(appointment.getDoctor().getId());
        response.setDoctorName(
                appointment.getDoctor().getFirstName() + " " +
                        appointment.getDoctor().getLastName()
        );

        response.setSpecialization(
                appointment.getDoctor().getSpecialization()
        );

        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setReason(appointment.getReason());
        response.setStatus(appointment.getStatus());

        return response;
    }
}