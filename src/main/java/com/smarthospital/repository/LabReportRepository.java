package com.smarthospital.repository;

import com.smarthospital.entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {
}