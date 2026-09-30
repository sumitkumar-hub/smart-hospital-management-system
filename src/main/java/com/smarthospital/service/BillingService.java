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


    // =========================================================
    // CREATE BILL
    // =========================================================

    public BillingResponseDTO createBill(BillingRequestDTO request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Billing billing = new Billing();

        billing.setPatient(patient);

        billing.setConsultationFee(
                safeAmount(request.getConsultationFee())
        );

        billing.setMedicineCharges(
                safeAmount(request.getMedicineCharges())
        );

        billing.setLabCharges(
                safeAmount(request.getLabCharges())
        );

        billing.setOtherCharges(
                safeAmount(request.getOtherCharges())
        );

        // Calculate total
        BigDecimal total = calculateTotal(
                request.getConsultationFee(),
                request.getMedicineCharges(),
                request.getLabCharges(),
                request.getOtherCharges()
        );

        billing.setTotalAmount(total);

        // Calculate payment
        applyPaymentDetails(
                billing,
                request.getPaymentStatus(),
                request.getAmountPaid()
        );

        billing.setPaymentMethod(request.getPaymentMethod());
        billing.setBillDate(request.getBillDate());

        Billing savedBill = billingRepository.save(billing);

        return convertToDTO(savedBill);
    }


    // =========================================================
    // GET ALL BILLS
    // =========================================================

    public List<BillingResponseDTO> getAllBills() {

        return billingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET BILL BY ID
    // =========================================================

    public BillingResponseDTO getBillById(Long id) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        return convertToDTO(bill);
    }


    // =========================================================
    // GET BILLS BY PATIENT
    // =========================================================

    public List<BillingResponseDTO> getBillsByPatient(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return billingRepository.findByPatientOrderByBillDateDesc(patient)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // UPDATE BILL
    // =========================================================

    public BillingResponseDTO updateBill(
            Long id,
            BillingRequestDTO request
    ) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        bill.setPatient(patient);

        bill.setConsultationFee(
                safeAmount(request.getConsultationFee())
        );

        bill.setMedicineCharges(
                safeAmount(request.getMedicineCharges())
        );

        bill.setLabCharges(
                safeAmount(request.getLabCharges())
        );

        bill.setOtherCharges(
                safeAmount(request.getOtherCharges())
        );

        // Recalculate total
        BigDecimal total = calculateTotal(
                request.getConsultationFee(),
                request.getMedicineCharges(),
                request.getLabCharges(),
                request.getOtherCharges()
        );

        bill.setTotalAmount(total);

        // Recalculate payment
        applyPaymentDetails(
                bill,
                request.getPaymentStatus(),
                request.getAmountPaid()
        );

        bill.setPaymentMethod(request.getPaymentMethod());
        bill.setBillDate(request.getBillDate());

        Billing updatedBill = billingRepository.save(bill);

        return convertToDTO(updatedBill);
    }


    // =========================================================
    // UPDATE PAYMENT STATUS
    // =========================================================

    public BillingResponseDTO updatePaymentStatus(
            Long id,
            String paymentStatus,
            BigDecimal amountPaid
    ) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        applyPaymentDetails(
                bill,
                paymentStatus,
                amountPaid
        );

        Billing updatedBill = billingRepository.save(bill);

        return convertToDTO(updatedBill);
    }


    // =========================================================
    // DELETE BILL
    // =========================================================

    public void deleteBill(Long id) {

        Billing bill = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        billingRepository.delete(bill);
    }


    // =========================================================
    // PAYMENT CALCULATION
    // =========================================================

    private void applyPaymentDetails(
            Billing billing,
            String paymentStatus,
            BigDecimal requestedAmountPaid
    ) {

        if (paymentStatus == null ||
                paymentStatus.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Payment status is required"
            );
        }

        String status =
                paymentStatus.trim().toUpperCase();

        BigDecimal total =
                safeAmount(billing.getTotalAmount());

        BigDecimal amountPaid;
        BigDecimal remainingAmount;


        // -----------------------------------------------------
        // UNPAID
        // -----------------------------------------------------

        if ("UNPAID".equals(status)) {

            amountPaid = BigDecimal.ZERO;

            remainingAmount = total;
        }


        // -----------------------------------------------------
        // PAID
        // -----------------------------------------------------

        else if ("PAID".equals(status)) {

            amountPaid = total;

            remainingAmount = BigDecimal.ZERO;
        }


        // -----------------------------------------------------
        // PARTIAL
        // -----------------------------------------------------

        else if ("PARTIAL".equals(status)) {

            if (requestedAmountPaid == null) {

                throw new IllegalArgumentException(
                        "Amount paid is required for partial payment"
                );
            }

            amountPaid =
                    requestedAmountPaid
                            .setScale(2, BigDecimal.ROUND_HALF_UP);

            if (amountPaid.compareTo(BigDecimal.ZERO) <= 0) {

                throw new IllegalArgumentException(
                        "Partial payment must be greater than 0"
                );
            }

            if (amountPaid.compareTo(total) >= 0) {

                throw new IllegalArgumentException(
                        "Partial payment must be less than total amount"
                );
            }

            remainingAmount =
                    total.subtract(amountPaid)
                            .setScale(
                                    2,
                                    BigDecimal.ROUND_HALF_UP
                            );
        }


        // -----------------------------------------------------
        // INVALID STATUS
        // -----------------------------------------------------

        else {

            throw new IllegalArgumentException(
                    "Invalid payment status. Use PAID, UNPAID or PARTIAL"
            );
        }

        billing.setPaymentStatus(status);
        billing.setAmountPaid(amountPaid);
        billing.setRemainingAmount(remainingAmount);
    }


    // =========================================================
    // CALCULATE TOTAL
    // =========================================================

    private BigDecimal calculateTotal(
            BigDecimal consultationFee,
            BigDecimal medicineCharges,
            BigDecimal labCharges,
            BigDecimal otherCharges
    ) {

        return safeAmount(consultationFee)
                .add(safeAmount(medicineCharges))
                .add(safeAmount(labCharges))
                .add(safeAmount(otherCharges))
                .setScale(
                        2,
                        BigDecimal.ROUND_HALF_UP
                );
    }


    // =========================================================
    // SAFE AMOUNT
    // =========================================================

    private BigDecimal safeAmount(BigDecimal amount) {

        if (amount == null) {
            return BigDecimal.ZERO;
        }

        return amount.setScale(
                2,
                BigDecimal.ROUND_HALF_UP
        );
    }


    // =========================================================
    // ENTITY → DTO
    // =========================================================

    private BillingResponseDTO convertToDTO(Billing bill) {

        BillingResponseDTO response =
                new BillingResponseDTO();

        response.setId(bill.getId());

        response.setPatientId(
                bill.getPatient().getId()
        );

        response.setPatientName(
                bill.getPatient().getFirstName()
                        + " "
                        + bill.getPatient().getLastName()
        );

        response.setConsultationFee(
                bill.getConsultationFee()
        );

        response.setMedicineCharges(
                bill.getMedicineCharges()
        );

        response.setLabCharges(
                bill.getLabCharges()
        );

        response.setOtherCharges(
                bill.getOtherCharges()
        );

        response.setTotalAmount(
                bill.getTotalAmount()
        );

        response.setAmountPaid(
                bill.getAmountPaid()
        );

        response.setRemainingAmount(
                bill.getRemainingAmount()
        );

        response.setPaymentStatus(
                bill.getPaymentStatus()
        );

        response.setPaymentMethod(
                bill.getPaymentMethod()
        );

        response.setBillDate(
                bill.getBillDate()
        );

        return response;
    }
}