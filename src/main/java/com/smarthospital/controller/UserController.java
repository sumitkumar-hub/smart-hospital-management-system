package com.smarthospital.controller;

import com.smarthospital.dto.RegisterRequestDTO;
import com.smarthospital.dto.UserResponseDTO;
import com.smarthospital.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @Valid @RequestBody RegisterRequestDTO request) {

        UserResponseDTO response = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}