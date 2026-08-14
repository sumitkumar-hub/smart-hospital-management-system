package com.smarthospital.repository;

import com.smarthospital.entity.PharmacyInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PharmacyInventoryRepository
        extends JpaRepository<PharmacyInventory, Long> {

    List<PharmacyInventory> findByMedicineId(Long medicineId);

    List<PharmacyInventory> findByQuantityLessThanEqual(Integer quantity);

    List<PharmacyInventory> findByExpiryDateBefore(LocalDate date);

    List<PharmacyInventory> findByBatchNumber(String batchNumber);
}