package com.smarthospital.service;

import com.smarthospital.dto.LabReportRequestDTO;
import com.smarthospital.dto.LabReportResponseDTO;
import com.smarthospital.entity.LabOrder;
import com.smarthospital.entity.LabReport;
import com.smarthospital.repository.LabOrderRepository;
import com.smarthospital.repository.LabReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabReportService {

    private final LabReportRepository labReportRepository;
    private final LabOrderRepository labOrderRepository;

    public LabReportService(
            LabReportRepository labReportRepository,
            LabOrderRepository labOrderRepository) {

        this.labReportRepository = labReportRepository;
        this.labOrderRepository = labOrderRepository;
    }

    // Create Lab Report
    public LabReportResponseDTO createLabReport(
            LabReportRequestDTO request) {

        LabOrder labOrder = labOrderRepository.findById(request.getLabOrderId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Order not found with ID: "
                                        + request.getLabOrderId()
                        ));

        LabReport labReport = new LabReport();

        labReport.setLabOrder(labOrder);
        labReport.setResult(request.getResult());
        labReport.setRemarks(request.getRemarks());
        labReport.setReportDate(LocalDate.now());

        LabReport savedReport =
                labReportRepository.save(labReport);

        return convertToResponse(savedReport);
    }

    // Get All Lab Reports
    public List<LabReportResponseDTO> getAllLabReports() {

        return labReportRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get Lab Report By ID
    public LabReportResponseDTO getLabReportById(Long id) {

        LabReport labReport = labReportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Report not found with ID: " + id
                        ));

        return convertToResponse(labReport);
    }

    // Update Lab Report
    public LabReportResponseDTO updateLabReport(
            Long id,
            LabReportRequestDTO request) {

        LabReport labReport = labReportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Report not found with ID: " + id
                        ));

        LabOrder labOrder = labOrderRepository.findById(
                request.getLabOrderId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Lab Order not found with ID: "
                                + request.getLabOrderId()
                ));

        labReport.setLabOrder(labOrder);
        labReport.setResult(request.getResult());
        labReport.setRemarks(request.getRemarks());

        LabReport updatedReport =
                labReportRepository.save(labReport);

        return convertToResponse(updatedReport);
    }

    // Delete Lab Report
    public void deleteLabReport(Long id) {

        if (!labReportRepository.existsById(id)) {
            throw new RuntimeException(
                    "Lab Report not found with ID: " + id
            );
        }

        labReportRepository.deleteById(id);
    }

    // Convert Entity to Response DTO
    private LabReportResponseDTO convertToResponse(
            LabReport labReport) {

        LabReportResponseDTO response =
                new LabReportResponseDTO();

        response.setId(labReport.getId());

        response.setPatientName(
                labReport.getLabOrder()
                        .getPatient()
                        .getFirstName()
                        + " "
                        + labReport.getLabOrder()
                        .getPatient()
                        .getLastName()
        );

        response.setDoctorName(
                labReport.getLabOrder()
                        .getDoctor()
                        .getFirstName()
                        + " "
                        + labReport.getLabOrder()
                        .getDoctor()
                        .getLastName()
        );

        response.setLabTestName(
                labReport.getLabOrder()
                        .getLabTest()
                        .getTestName()
        );

        response.setResult(labReport.getResult());
        response.setRemarks(labReport.getRemarks());
        response.setReportDate(labReport.getReportDate());

        return response;
    }
}