package com.smarthospital.service;

import com.smarthospital.dto.DoctorRequestDTO;
import com.smarthospital.dto.DoctorResponseDTO;
import com.smarthospital.entity.Doctor;
import com.smarthospital.exception.ResourceAlreadyExistsException;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // Add Doctor
    public DoctorResponseDTO addDoctor(DoctorRequestDTO request) {

        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Doctor already exists with this email.");
        }

        Doctor doctor = new Doctor();

        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setExperience(request.getExperience());
        doctor.setQualification(request.getQualification());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailable(request.getAvailable());

        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToResponse(savedDoctor);
    }

    // Get All Doctors
    public List<DoctorResponseDTO> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Doctor By Id
    public DoctorResponseDTO getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        return mapToResponse(doctor);
    }

    // Update Doctor
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setExperience(request.getExperience());
        doctor.setQualification(request.getQualification());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailable(request.getAvailable());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return mapToResponse(updatedDoctor);
    }

    // Delete Doctor
    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctorRepository.delete(doctor);
    }

    // Get Doctors By Specialization
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {

        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Available Doctors
    public List<DoctorResponseDTO> getAvailableDoctors() {

        return doctorRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Mapping Method
    private DoctorResponseDTO mapToResponse(Doctor doctor) {

        DoctorResponseDTO response = new DoctorResponseDTO();

        response.setId(doctor.getId());
        response.setFirstName(doctor.getFirstName());
        response.setLastName(doctor.getLastName());
        response.setEmail(doctor.getEmail());
        response.setPhone(doctor.getPhone());
        response.setSpecialization(doctor.getSpecialization());
        response.setExperience(doctor.getExperience());
        response.setQualification(doctor.getQualification());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setAvailable(doctor.getAvailable());

        return response;
    }
}