package com.smarthospital.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        String authHeader = request.getHeader("Authorization");

        System.out.println("========================================");
        System.out.println("JWT FILTER");
        System.out.println("Request: " + request.getMethod() + " " + requestUri);
        System.out.println("Authorization header present: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("JWT: No Bearer token found");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String email = jwtService.extractEmail(token);

            System.out.println("JWT email: " + email);

            if (email == null) {
                System.out.println("JWT ERROR: Email is null");
                filterChain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(email);

                System.out.println("User found: " + userDetails.getUsername());
                System.out.println("Authorities: " + userDetails.getAuthorities());

                boolean valid =
                        jwtService.isTokenValid(
                                token,
                                userDetails.getUsername()
                        );

                System.out.println("JWT valid: " + valid);

                if (valid) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    System.out.println("AUTHENTICATION SUCCESS");
                    System.out.println(
                            "Logged in user: "
                                    + userDetails.getUsername()
                    );
                    System.out.println(
                            "Authorities: "
                                    + userDetails.getAuthorities()
                    );

                } else {

                    System.out.println("JWT ERROR: Token is invalid");
                }

            } else {

                System.out.println(
                        "SecurityContext already contains authentication"
                );
            }

        } catch (JwtException e) {

            System.out.println("JWT PARSING ERROR: " + e.getMessage());
            SecurityContextHolder.clearContext();

        } catch (Exception e) {

            System.out.println(
                    "JWT AUTHENTICATION ERROR: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Message: "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);

        System.out.println("========================================");
    }
}