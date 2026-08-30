package com.smarthospital.service;

import com.smarthospital.dto.ChartDataDTO;
import com.smarthospital.dto.DashboardResponseDTO;
import com.smarthospital.entity.Appointment;
import com.smarthospital.entity.LabOrder;
import com.smarthospital.repository.AppointmentRepository;
import com.smarthospital.repository.DoctorRepository;
import com.smarthospital.repository.LabOrderRepository;
import com.smarthospital.repository.PatientRepository;
import com.smarthospital.repository.PharmacyInventoryRepository;
import com.smarthospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private LabOrderRepository labOrderRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PharmacyInventoryRepository pharmacyInventoryRepository;


    // =========================
    // GET DASHBOARD
    // =========================
    public DashboardResponseDTO getDashboard() {

        DashboardResponseDTO response = new DashboardResponseDTO();

        // =========================
        // PATIENTS
        // =========================
        response.setTotalPatients(
                patientRepository.count()
        );

        response.setActivePatients(
                patientRepository.findAll()
                        .stream()
                        .filter(patient ->
                                Boolean.TRUE.equals(patient.getActive()))
                        .count()
        );


        // =========================
        // DOCTORS
        // =========================
        response.setTotalDoctors(
                doctorRepository.count()
        );

        response.setActiveDoctors(
                doctorRepository.findByAvailableTrue()
                        .size()
        );


        // =========================
        // APPOINTMENTS
        // =========================
        response.setTotalAppointments(
                appointmentRepository.count()
        );

        response.setPendingAppointments(
                getAppointmentCountByStatus("PENDING")
        );

        response.setCompletedAppointments(
                getAppointmentCountByStatus("COMPLETED")
        );

        response.setCancelledAppointments(
                getAppointmentCountByStatus("CANCELLED")
        );


        // =========================
        // LAB ORDERS
        // =========================
        List<LabOrder> labOrders =
                labOrderRepository.findAll();

        response.setTotalLabOrders(
                labOrders.size()
        );

        response.setPendingLabOrders(
                labOrders.stream()
                        .filter(order ->
                                "PENDING".equalsIgnoreCase(
                                        order.getStatus()))
                        .count()
        );

        response.setCompletedLabOrders(
                labOrders.stream()
                        .filter(order ->
                                "COMPLETED".equalsIgnoreCase(
                                        order.getStatus()))
                        .count()
        );


        // =========================
        // PRESCRIPTIONS
        // =========================
        response.setTotalPrescriptions(
                prescriptionRepository.count()
        );


        // =========================
        // PHARMACY INVENTORY
        // =========================
        response.setTotalInventoryItems(
                pharmacyInventoryRepository.count()
        );

        response.setLowStockItems(
                pharmacyInventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getQuantity()
                                        <= inventory.getMinimumStockLevel())
                        .count()
        );

        response.setExpiredInventoryItems(
                pharmacyInventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getExpiryDate() != null
                                        && inventory.getExpiryDate()
                                        .isBefore(LocalDate.now()))
                        .count()
        );

        return response;
    }


    // =========================
    // APPOINTMENT STATUS COUNT
    // =========================
    private long getAppointmentCountByStatus(String status) {

        List<Appointment> appointments =
                appointmentRepository.findByStatus(status);

        return appointments.size();
    }


    // =========================
    // APPOINTMENT STATUS CHART
    // =========================
    public List<ChartDataDTO> getAppointmentStatusChart() {

        return List.of(
                new ChartDataDTO(
                        "PENDING",
                        getAppointmentCountByStatus("PENDING")
                ),
                new ChartDataDTO(
                        "COMPLETED",
                        getAppointmentCountByStatus("COMPLETED")
                ),
                new ChartDataDTO(
                        "CANCELLED",
                        getAppointmentCountByStatus("CANCELLED")
                )
        );
    }


    // =========================
    // LAB ORDER STATUS CHART
    // =========================
    public List<ChartDataDTO> getLabOrderStatusChart() {

        List<LabOrder> labOrders =
                labOrderRepository.findAll();

        long pending = labOrders.stream()
                .filter(order ->
                        "PENDING".equalsIgnoreCase(order.getStatus()))
                .count();

        long completed = labOrders.stream()
                .filter(order ->
                        "COMPLETED".equalsIgnoreCase(order.getStatus()))
                .count();

        return List.of(
                new ChartDataDTO("PENDING", pending),
                new ChartDataDTO("COMPLETED", completed)
        );
    }


    // =========================
    // PHARMACY STOCK CHART
    // =========================
    public List<ChartDataDTO> getPharmacyStockChart() {

        long normalStock =
                pharmacyInventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getQuantity()
                                        > inventory.getMinimumStockLevel())
                        .count();

        long lowStock =
                pharmacyInventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getQuantity()
                                        <= inventory.getMinimumStockLevel())
                        .count();

        long expired =
                pharmacyInventoryRepository.findAll()
                        .stream()
                        .filter(inventory ->
                                inventory.getExpiryDate() != null
                                        && inventory.getExpiryDate()
                                        .isBefore(LocalDate.now()))
                        .count();

        return List.of(
                new ChartDataDTO("NORMAL STOCK", normalStock),
                new ChartDataDTO("LOW STOCK", lowStock),
                new ChartDataDTO("EXPIRED", expired)
        );
    }
}