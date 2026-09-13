package com.smarthospital.service;

import com.smarthospital.dto.LoginRequestDTO;
import com.smarthospital.dto.LoginResponseDTO;
import com.smarthospital.dto.RegisterRequestDTO;
import com.smarthospital.entity.Patient;
import com.smarthospital.entity.User;
import com.smarthospital.repository.PatientRepository;
import com.smarthospital.repository.UserRepository;
import com.smarthospital.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;


    // ==========================
    // Login
    // ==========================

    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password")
                );


        boolean passwordMatched =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatched) {
            throw new RuntimeException("Invalid Email or Password");
        }


        String token =
                jwtService.generateToken(user.getEmail());


        LoginResponseDTO response =
                new LoginResponseDTO();


        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken(token);
        response.setType("Bearer");


        // Get Patient ID for patient users
        if ("PATIENT".equalsIgnoreCase(user.getRole())) {

            patientRepository.findByUserId(user.getId())
                    .ifPresent(patient ->
                            response.setPatientId(patient.getId())
                    );
        }


        return response;
    }


    // ==========================
    // Register User + Patient
    // ==========================

    @Transactional
    public Patient register(RegisterRequestDTO request) {


        // ==========================
        // Check User Email
        // ==========================

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // ==========================
        // Check Patient Email
        // ==========================

        if (patientRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // ==========================
        // Check Patient Phone
        // ==========================

        if (patientRepository
                .findByPhone(request.getPhone())
                .isPresent()) {

            throw new RuntimeException(
                    "Phone number already registered"
            );
        }


        // ==========================
        // Create User
        // ==========================

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Public registration is ALWAYS PATIENT
        user.setRole("PATIENT");


        User savedUser =
                userRepository.save(user);


        // ==========================
        // Create Patient
        // ==========================

        Patient patient = new Patient();

        patient.setUser(savedUser);

        patient.setFirstName(
                request.getFirstName()
        );

        patient.setLastName(
                request.getLastName()
        );

        patient.setDateOfBirth(
                request.getDateOfBirth()
        );

        patient.setGender(
                request.getGender()
        );

        patient.setPhone(
                request.getPhone()
        );

        patient.setEmail(
                request.getEmail()
        );

        patient.setAddress(
                request.getAddress()
        );

        patient.setBloodGroup(
                request.getBloodGroup()
        );

        patient.setEmergencyContactName(
                request.getEmergencyContactName()
        );

        patient.setEmergencyContactPhone(
                request.getEmergencyContactPhone()
        );

        patient.setActive(true);


        // Save Patient
        return patientRepository.save(patient);
    }
}