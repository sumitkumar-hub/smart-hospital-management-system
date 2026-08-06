package com.smarthospital.service;

import com.smarthospital.dto.MedicalRecordRequestDTO;
import com.smarthospital.dto.MedicalRecordResponseDTO;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.MedicalRecord;
import com.smarthospital.entity.Patient;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.MedicalRecordRepository;
import com.smarthospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // Add Medical Record
    public MedicalRecordResponseDTO addMedicalRecord(MedicalRecordRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        MedicalRecord record = new MedicalRecord();

        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(request.getPrescription());
        record.setNotes(request.getNotes());
        record.setVisitDate(request.getVisitDate());

        MedicalRecord savedRecord = medicalRecordRepository.save(record);

        return convertToDTO(savedRecord);
    }

    // Get All Medical Records
    public List<MedicalRecordResponseDTO> getAllMedicalRecords() {

        return medicalRecordRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get Medical Record By ID
    public MedicalRecordResponseDTO getMedicalRecordById(Long id) {

        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medical record not found"));

        return convertToDTO(record);
    }

    // Get Medical Records By Patient
    public List<MedicalRecordResponseDTO> getMedicalRecordsByPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return medicalRecordRepository.findByPatientOrderByVisitDateDesc(patient)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update Medical Record
    public MedicalRecordResponseDTO updateMedicalRecord(Long id,
                                                        MedicalRecordRequestDTO request) {

        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medical record not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(request.getPrescription());
        record.setNotes(request.getNotes());
        record.setVisitDate(request.getVisitDate());

        MedicalRecord updatedRecord = medicalRecordRepository.save(record);

        return convertToDTO(updatedRecord);
    }

    // Delete Medical Record
    public void deleteMedicalRecord(Long id) {

        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medical record not found"));

        medicalRecordRepository.delete(record);
    }

    // Convert Entity to DTO
    private MedicalRecordResponseDTO convertToDTO(MedicalRecord record) {

        MedicalRecordResponseDTO response = new MedicalRecordResponseDTO();

        response.setId(record.getId());

        response.setPatientId(record.getPatient().getId());
        response.setPatientName(
                record.getPatient().getFirstName() + " " +
                        record.getPatient().getLastName()
        );

        response.setDoctorId(record.getDoctor().getId());
        response.setDoctorName(
                record.getDoctor().getFirstName() + " " +
                        record.getDoctor().getLastName()
        );
        response.setSpecialization(record.getDoctor().getSpecialization());

        response.setDiagnosis(record.getDiagnosis());
        response.setPrescription(record.getPrescription());
        response.setNotes(record.getNotes());
        response.setVisitDate(record.getVisitDate());

        return response;
    }
}