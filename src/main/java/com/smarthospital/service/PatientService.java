package com.smarthospital.service;

import com.smarthospital.dto.PatientRequestDTO;
import com.smarthospital.dto.PatientResponseDTO;
import com.smarthospital.entity.Patient;
import com.smarthospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    // Add Patient
    public PatientResponseDTO addPatient(PatientRequestDTO request) {

        if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (patientRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }

        Patient patient = new Patient();

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        patient.setActive(true);

        Patient savedPatient = patientRepository.save(patient);

        return mapToResponse(savedPatient);
    }

    // Get All Patients
    public List<PatientResponseDTO> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Patient By Id
    public PatientResponseDTO getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapToResponse(patient);
    }
    // Update Patient
    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());

        Patient updatedPatient = patientRepository.save(patient);

        return mapToResponse(updatedPatient);
    }

    // Common Mapper
    private PatientResponseDTO mapToResponse(Patient patient) {

        PatientResponseDTO response = new PatientResponseDTO();

        response.setId(patient.getId());
        response.setFirstName(patient.getFirstName());
        response.setLastName(patient.getLastName());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setGender(patient.getGender());
        response.setPhone(patient.getPhone());
        response.setEmail(patient.getEmail());
        response.setAddress(patient.getAddress());
        response.setBloodGroup(patient.getBloodGroup());
        response.setEmergencyContactName(patient.getEmergencyContactName());
        response.setEmergencyContactPhone(patient.getEmergencyContactPhone());
        response.setActive(patient.getActive());

        return response;
    }
}