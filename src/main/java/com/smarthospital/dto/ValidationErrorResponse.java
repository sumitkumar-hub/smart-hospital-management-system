package com.smarthospital.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ValidationErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private Map<String, String> errors;

    public ValidationErrorResponse() {
    }

    public ValidationErrorResponse(LocalDateTime timestamp, int status, Map<String, String> errors) {
        this.timestamp = timestamp;
        this.status = status;
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }
}