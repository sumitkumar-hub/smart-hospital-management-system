package com.smarthospital.service;

import com.smarthospital.entity.AuditLog;
import com.smarthospital.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    // Create audit log
    public AuditLog createLog(
            String action,
            String entityName,
            Long entityId,
            String performedBy,
            String description) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setEntityName(entityName);
        auditLog.setEntityId(entityId);
        auditLog.setPerformedBy(performedBy);
        auditLog.setDescription(description);
        auditLog.setTimestamp(LocalDateTime.now());

        return auditLogRepository.save(auditLog);
    }

    // Get all audit logs
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    // Get audit log by ID
    public AuditLog getLogById(Long id) {
        return auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Audit log not found"));
    }

    // Delete audit log
    public void deleteLog(Long id) {

        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Audit log not found"));

        auditLogRepository.delete(auditLog);
    }
}
