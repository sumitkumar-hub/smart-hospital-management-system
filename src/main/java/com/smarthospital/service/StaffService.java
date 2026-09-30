package com.smarthospital.service;

import com.smarthospital.dto.StaffRequestDTO;
import com.smarthospital.dto.UserResponseDTO;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.User;
import com.smarthospital.exception.ResourceAlreadyExistsException;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class StaffService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================================================
    // CREATE STAFF ACCOUNT
    // =========================================================

    @Transactional
    public UserResponseDTO createStaff(StaffRequestDTO request) {

        String role = request.getRole()
                .trim()
                .toUpperCase();


        // =====================================================
        // ALLOWED STAFF ROLES
        // =====================================================

        Set<String> allowedRoles = Set.of(
                "ADMIN",
                "DOCTOR",
                "RECEPTIONIST",
                "PHARMACIST",
                "LABORATORY"
        );


        if (!allowedRoles.contains(role)) {

            throw new IllegalArgumentException(
                    "Invalid role. Allowed roles are: ADMIN, DOCTOR, RECEPTIONIST, PHARMACIST, LABORATORY"
            );
        }


        // =====================================================
        // CHECK USER EMAIL
        // =====================================================

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new ResourceAlreadyExistsException(
                    "User already exists with this email."
            );
        }


        // =====================================================
        // DOCTOR EMAIL CHECK
        // =====================================================

        if ("DOCTOR".equals(role)) {

            if (doctorRepository
                    .findByEmail(request.getEmail())
                    .isPresent()) {

                throw new ResourceAlreadyExistsException(
                        "Doctor already exists with this email."
                );
            }


            // =================================================
            // VALIDATE DOCTOR DETAILS
            // =================================================

            if (request.getSpecialization() == null ||
                    request.getSpecialization().isBlank()) {

                throw new IllegalArgumentException(
                        "Specialization is required for doctor."
                );
            }


            if (request.getExperience() == null ||
                    request.getExperience() < 0) {

                throw new IllegalArgumentException(
                        "Valid experience is required for doctor."
                );
            }


            if (request.getQualification() == null ||
                    request.getQualification().isBlank()) {

                throw new IllegalArgumentException(
                        "Qualification is required for doctor."
                );
            }


            if (request.getConsultationFee() == null ||
                    request.getConsultationFee() <= 0) {

                throw new IllegalArgumentException(
                        "Valid consultation fee is required for doctor."
                );
            }
        }


        // =====================================================
        // CREATE USER
        // =====================================================

        User user = new User();

        user.setFirstName(
                request.getFirstName().trim()
        );

        user.setLastName(
                request.getLastName().trim()
        );

        user.setEmail(
                request.getEmail().trim().toLowerCase()
        );

        user.setPhone(
                request.getPhone().trim()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(role);


        User savedUser =
                userRepository.save(user);


        // =====================================================
        // CREATE DOCTOR RECORD
        // =====================================================

        Doctor savedDoctor = null;

        if ("DOCTOR".equals(role)) {

            Doctor doctor = new Doctor();

            doctor.setFirstName(
                    request.getFirstName().trim()
            );

            doctor.setLastName(
                    request.getLastName().trim()
            );

            doctor.setEmail(
                    request.getEmail().trim().toLowerCase()
            );

            doctor.setPhone(
                    request.getPhone().trim()
            );

            doctor.setSpecialization(
                    request.getSpecialization().trim()
            );

            doctor.setExperience(
                    request.getExperience()
            );

            doctor.setQualification(
                    request.getQualification().trim()
            );

            doctor.setConsultationFee(
                    request.getConsultationFee()
            );

            doctor.setAvailable(
                    request.getAvailable() == null
                            ? true
                            : request.getAvailable()
            );


            savedDoctor =
                    doctorRepository.save(doctor);
        }


        // =====================================================
        // CREATE RESPONSE
        // =====================================================

        UserResponseDTO response =
                new UserResponseDTO();

        response.setId(
                savedUser.getId()
        );

        response.setFirstName(
                savedUser.getFirstName()
        );

        response.setLastName(
                savedUser.getLastName()
        );

        response.setEmail(
                savedUser.getEmail()
        );

        response.setPhone(
                savedUser.getPhone()
        );

        response.setRole(
                savedUser.getRole()
        );


        if (savedDoctor != null) {

            response.setDoctorId(
                    savedDoctor.getId()
            );
        }


        return response;
    }
}