package com.smarthospital.security;

import com.smarthospital.entity.Patient;
import com.smarthospital.entity.User;
import com.smarthospital.repository.PatientRepository;
import com.smarthospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // Check patient account status
        if ("PATIENT".equalsIgnoreCase(user.getRole())) {

            Patient patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "Patient profile not found"
                            )
                    );

            if (Boolean.FALSE.equals(patient.getActive())) {
                throw new UsernameNotFoundException(
                        "Patient account is inactive"
                );
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority(
                                "ROLE_" + user.getRole()
                        )
                )
        );
    }
}