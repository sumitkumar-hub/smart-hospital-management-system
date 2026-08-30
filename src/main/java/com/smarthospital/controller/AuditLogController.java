package com.smarthospital.controller;

import com.smarthospital.entity.AuditLog;
import com.smarthospital.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    // Get all audit logs
    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(
                auditLogService.getAllLogs()
        );
    }

    // Get audit log by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuditLog> getLogById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                auditLogService.getLogById(id)
        );
    }

    // Create audit log
    @PostMapping
    public ResponseEntity<AuditLog> createLog(
            @RequestParam String action,
            @RequestParam String entityName,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) String performedBy,
            @RequestParam(required = false) String description) {

        return ResponseEntity.ok(
                auditLogService.createLog(
                        action,
                        entityName,
                        entityId,
                        performedBy,
                        description
                )
        );
    }

    // Delete audit log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id) {

        auditLogService.deleteLog(id);

        return ResponseEntity.noContent().build();
    }
}
