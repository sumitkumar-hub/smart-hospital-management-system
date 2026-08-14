package com.smarthospital.service;

import com.smarthospital.dto.LabOrderRequestDTO;
import com.smarthospital.dto.LabOrderResponseDTO;
import com.smarthospital.entity.Doctor;
import com.smarthospital.entity.LabOrder;
import com.smarthospital.entity.LabTest;
import com.smarthospital.entity.Patient;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.LabOrderRepository;
import com.smarthospital.repository.LabTestRepository;
import com.smarthospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabOrderService {

    private final LabOrderRepository labOrderRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final LabTestRepository labTestRepository;

    public LabOrderService(
            LabOrderRepository labOrderRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            LabTestRepository labTestRepository) {

        this.labOrderRepository = labOrderRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.labTestRepository = labTestRepository;
    }

    // Create Lab Order
    public LabOrderResponseDTO createLabOrder(LabOrderRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + request.getPatientId()
                        ));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found with ID: " + request.getDoctorId()
                        ));

        LabTest labTest = labTestRepository.findById(request.getLabTestId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Test not found with ID: " + request.getLabTestId()
                        ));

        LabOrder labOrder = new LabOrder();

        labOrder.setPatient(patient);
        labOrder.setDoctor(doctor);
        labOrder.setLabTest(labTest);
        labOrder.setOrderDate(LocalDate.now());
        labOrder.setStatus("PENDING");
        labOrder.setRemarks(request.getRemarks());

        LabOrder savedOrder = labOrderRepository.save(labOrder);

        return convertToResponse(savedOrder);
    }

    // Get All Lab Orders
    public List<LabOrderResponseDTO> getAllLabOrders() {

        return labOrderRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get Lab Order By ID
    public LabOrderResponseDTO getLabOrderById(Long id) {

        LabOrder labOrder = labOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Order not found with ID: " + id
                        ));

        return convertToResponse(labOrder);
    }

    // Update Lab Order
    public LabOrderResponseDTO updateLabOrder(
            Long id,
            LabOrderRequestDTO request) {

        LabOrder labOrder = labOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Order not found with ID: " + id
                        ));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + request.getPatientId()
                        ));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found with ID: " + request.getDoctorId()
                        ));

        LabTest labTest = labTestRepository.findById(request.getLabTestId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Test not found with ID: " + request.getLabTestId()
                        ));

        labOrder.setPatient(patient);
        labOrder.setDoctor(doctor);
        labOrder.setLabTest(labTest);
        labOrder.setRemarks(request.getRemarks());

        LabOrder updatedOrder = labOrderRepository.save(labOrder);

        return convertToResponse(updatedOrder);
    }

    // Update Lab Order Status
    public LabOrderResponseDTO updateLabOrderStatus(
            Long id,
            String status) {

        LabOrder labOrder = labOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lab Order not found with ID: " + id
                        ));

        labOrder.setStatus(status);

        LabOrder updatedOrder = labOrderRepository.save(labOrder);

        return convertToResponse(updatedOrder);
    }

    // Delete Lab Order
    public void deleteLabOrder(Long id) {

        if (!labOrderRepository.existsById(id)) {
            throw new RuntimeException(
                    "Lab Order not found with ID: " + id
            );
        }

        labOrderRepository.deleteById(id);
    }

    // Convert Entity to Response DTO
    private LabOrderResponseDTO convertToResponse(LabOrder labOrder) {

        LabOrderResponseDTO response = new LabOrderResponseDTO();

        response.setId(labOrder.getId());

        response.setPatientId(
                labOrder.getPatient().getId()
        );

        response.setPatientName(
                labOrder.getPatient().getFirstName()
                        + " "
                        + labOrder.getPatient().getLastName()
        );

        response.setDoctorId(
                labOrder.getDoctor().getId()
        );

        response.setDoctorName(
                labOrder.getDoctor().getFirstName()
                        + " "
                        + labOrder.getDoctor().getLastName()
        );

        response.setLabTestId(
                labOrder.getLabTest().getId()
        );

        response.setTestName(
                labOrder.getLabTest().getTestName()
        );

        response.setPrice(
                labOrder.getLabTest().getPrice()
        );

        response.setOrderDate(
                labOrder.getOrderDate()
        );

        response.setStatus(
                labOrder.getStatus()
        );

        response.setRemarks(
                labOrder.getRemarks()
        );

        return response;
    }
}