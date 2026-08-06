package com.smarthospital.service;

import com.smarthospital.dto.BillingRequestDTO;
import com.smarthospital.dto.BillingResponseDTO;
import com.smarthospital.entity.Billing;
import com.smarthospital.entity.Patient;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.BillingRepository;
import com.smarthospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private PatientRepository patientRepository;

    // Create Bill
    public BillingResponseDTO createBill(BillingRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Billing billing = new Billing();

        billing.setPatient(patient);
        billing.setConsultationFee(request.getConsultationFee());
        billing.setMedicineCharges(request.getMedicineCharges());
        billing.setLabCharges(request.getLabCharges());
        billing.setOtherCharges(request.getOtherCharges());

        // Auto Calculate Total
        BigDecimal total = request.getConsultationFee()
                .add(request.getMedicineCharges())
                .add(request.getLabCharges())
                .add(request.getOtherCharges());

        billing.setTotalAmount(total);

        billing.setPaymentStatus(request.getPaymentStatus());
        billing.setPaymentMethod(request.getPaymentMethod());
        billing.setBillDate(request.getBillDate());

        Billing savedBill = billingRepository.save(billing);

        return convertToDTO(savedBill);
    }

    // Get All Bills
    public List<BillingResponseDTO> getAllBills() {

        return billingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get Bill By ID
    public BillingResponseDTO getBillById(Long id) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        return convertToDTO(bill);
    }

    // Get Bills By Patient
    public List<BillingResponseDTO> getBillsByPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return billingRepository.findByPatientOrderByBillDateDesc(patient)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update Bill
    public BillingResponseDTO updateBill(Long id, BillingRequestDTO request) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        bill.setPatient(patient);
        bill.setConsultationFee(request.getConsultationFee());
        bill.setMedicineCharges(request.getMedicineCharges());
        bill.setLabCharges(request.getLabCharges());
        bill.setOtherCharges(request.getOtherCharges());

        BigDecimal total = request.getConsultationFee()
                .add(request.getMedicineCharges())
                .add(request.getLabCharges())
                .add(request.getOtherCharges());

        bill.setTotalAmount(total);

        bill.setPaymentStatus(request.getPaymentStatus());
        bill.setPaymentMethod(request.getPaymentMethod());
        bill.setBillDate(request.getBillDate());

        Billing updatedBill = billingRepository.save(bill);

        return convertToDTO(updatedBill);
    }

    // Update Payment Status
    public BillingResponseDTO updatePaymentStatus(Long id, String paymentStatus) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        bill.setPaymentStatus(paymentStatus);

        Billing updatedBill = billingRepository.save(bill);

        return convertToDTO(updatedBill);
    }

    // Delete Bill
    public void deleteBill(Long id) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        billingRepository.delete(bill);
    }

    // Convert Entity to DTO
    private BillingResponseDTO convertToDTO(Billing bill) {

        BillingResponseDTO response = new BillingResponseDTO();

        response.setId(bill.getId());

        response.setPatientId(bill.getPatient().getId());
        response.setPatientName(
                bill.getPatient().getFirstName() + " " +
                        bill.getPatient().getLastName()
        );

        response.setConsultationFee(bill.getConsultationFee());
        response.setMedicineCharges(bill.getMedicineCharges());
        response.setLabCharges(bill.getLabCharges());
        response.setOtherCharges(bill.getOtherCharges());
        response.setTotalAmount(bill.getTotalAmount());

        response.setPaymentStatus(bill.getPaymentStatus());
        response.setPaymentMethod(bill.getPaymentMethod());
        response.setBillDate(bill.getBillDate());

        return response;
    }
}