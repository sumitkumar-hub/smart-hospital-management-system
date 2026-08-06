package com.smarthospital.service;

import com.smarthospital.dto.PrescriptionRequestDTO;
import com.smarthospital.dto.PrescriptionResponseDTO;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.MedicalRecord;
import com.smarthospital.entity.Patient;
import com.smarthospital.entity.Prescription;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.MedicalRecordRepository;
import com.smarthospital.repository.PatientRepository;
import com.smarthospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    // Add Prescription
    public PrescriptionResponseDTO addPrescription(PrescriptionRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        MedicalRecord medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medical record not found"));

        Prescription prescription = new Prescription();

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedicalRecord(medicalRecord);
        prescription.setMedicineName(request.getMedicineName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setDuration(request.getDuration());
        prescription.setInstructions(request.getInstructions());

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        return convertToDTO(savedPrescription);
    }

    // Get All Prescriptions
    public List<PrescriptionResponseDTO> getAllPrescriptions() {

        return prescriptionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get Prescription By ID
    public PrescriptionResponseDTO getPrescriptionById(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        return convertToDTO(prescription);
    }

    // Get Prescriptions By Patient
    public List<PrescriptionResponseDTO> getPrescriptionsByPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return prescriptionRepository.findByPatientOrderByIdDesc(patient)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update Prescription
    public PrescriptionResponseDTO updatePrescription(Long id,
                                                      PrescriptionRequestDTO request) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        MedicalRecord medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medical record not found"));

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedicalRecord(medicalRecord);
        prescription.setMedicineName(request.getMedicineName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setDuration(request.getDuration());
        prescription.setInstructions(request.getInstructions());

        Prescription updatedPrescription = prescriptionRepository.save(prescription);

        return convertToDTO(updatedPrescription);
    }

    // Delete Prescription
    public void deletePrescription(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        prescriptionRepository.delete(prescription);
    }

    // Convert Entity to DTO
    private PrescriptionResponseDTO convertToDTO(Prescription prescription) {

        PrescriptionResponseDTO response = new PrescriptionResponseDTO();

        response.setId(prescription.getId());

        response.setPatientId(prescription.getPatient().getId());
        response.setPatientName(
                prescription.getPatient().getFirstName() + " " +
                        prescription.getPatient().getLastName()
        );

        response.setDoctorId(prescription.getDoctor().getId());
        response.setDoctorName(
                prescription.getDoctor().getFirstName() + " " +
                        prescription.getDoctor().getLastName()
        );

        response.setMedicalRecordId(
                prescription.getMedicalRecord().getId()
        );

        response.setMedicineName(prescription.getMedicineName());
        response.setDosage(prescription.getDosage());
        response.setFrequency(prescription.getFrequency());
        response.setDuration(prescription.getDuration());
        response.setInstructions(prescription.getInstructions());

        return response;
    }
}