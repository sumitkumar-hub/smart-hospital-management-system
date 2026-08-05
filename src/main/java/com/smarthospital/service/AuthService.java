package com.smarthospital.service;

import com.smarthospital.dto.LoginRequestDTO;
import com.smarthospital.dto.LoginResponseDTO;
import com.smarthospital.entity.User;
import com.smarthospital.repository.UserRepository;
import com.smarthospital.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO request) {

        // ================= DEBUG =================
        System.out.println("\n====================================");
        System.out.println("LOGIN API CALLED");
        System.out.println("Email Entered : " + request.getEmail());
        System.out.println("Password Entered : " + request.getPassword());
        System.out.println("====================================");
        // =========================================

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("User NOT FOUND in database.");
                    return new RuntimeException("Invalid Email or Password");
                });

        // ================= DEBUG =================
        System.out.println("User Found Successfully");
        System.out.println("Database Email : " + user.getEmail());
        System.out.println("Database Password (BCrypt) : " + user.getPassword());

        boolean passwordMatched =
                passwordEncoder.matches(request.getPassword(), user.getPassword());

        System.out.println("Password Match : " + passwordMatched);
        // =========================================

        if (!passwordMatched) {
            throw new RuntimeException("Invalid Email or Password");
        }

        // Generate JWT Token
        String token = jwtService.generateToken(user.getEmail());

        // ================= DEBUG =================
        System.out.println("JWT Generated Successfully");
        System.out.println("Token : " + token);
        System.out.println("====================================\n");
        // =========================================

        LoginResponseDTO response = new LoginResponseDTO();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        response.setToken(token);
        response.setType("Bearer");

        return response;
    }
}