package com.smarthospital.repository;

import com.smarthospital.entity.Billing;
import com.smarthospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {

    // Get all bills of a patient
    List<Billing> findByPatient(Patient patient);

    // Get latest bills of a patient
    List<Billing> findByPatientOrderByBillDateDesc(Patient patient);

    // Get bills by payment status
    List<Billing> findByPaymentStatus(String paymentStatus);
}

