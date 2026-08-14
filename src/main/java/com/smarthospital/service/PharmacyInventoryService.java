package com.smarthospital.service;

import com.smarthospital.dto.PharmacyInventoryRequestDTO;
import com.smarthospital.dto.PharmacyInventoryResponseDTO;
import com.smarthospital.entity.Medicine;
import com.smarthospital.entity.PharmacyInventory;
import com.smarthospital.exception.ResourceNotFoundException;
import com.smarthospital.repository.MedicineRepository;
import com.smarthospital.repository.PharmacyInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PharmacyInventoryService {

    @Autowired
    private PharmacyInventoryRepository pharmacyInventoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;


    // =========================
    // ADD INVENTORY
    // =========================
    public PharmacyInventoryResponseDTO addInventory(
            PharmacyInventoryRequestDTO request) {

        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine not found"));

        PharmacyInventory inventory = new PharmacyInventory();

        inventory.setMedicine(medicine);
        inventory.setQuantity(request.getQuantity());
        inventory.setMinimumStockLevel(request.getMinimumStockLevel());
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setExpiryDate(request.getExpiryDate());
        inventory.setReceivedDate(
                request.getReceivedDate() != null
                        ? request.getReceivedDate()
                        : LocalDate.now()
        );

        PharmacyInventory savedInventory =
                pharmacyInventoryRepository.save(inventory);

        return convertToResponseDTO(savedInventory);
    }


    // =========================
    // GET ALL INVENTORY
    // =========================
    public List<PharmacyInventoryResponseDTO> getAllInventory() {

        return pharmacyInventoryRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // =========================
    // GET INVENTORY BY ID
    // =========================
    public PharmacyInventoryResponseDTO getInventoryById(Long id) {

        PharmacyInventory inventory =
                pharmacyInventoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Pharmacy inventory not found"));

        return convertToResponseDTO(inventory);
    }


    // =========================
    // GET INVENTORY BY MEDICINE
    // =========================
    public List<PharmacyInventoryResponseDTO> getInventoryByMedicine(
            Long medicineId) {

        medicineRepository.findById(medicineId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine not found"));

        return pharmacyInventoryRepository.findByMedicineId(medicineId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // =========================
    // UPDATE INVENTORY
    // =========================
    public PharmacyInventoryResponseDTO updateInventory(
            Long id,
            PharmacyInventoryRequestDTO request) {

        PharmacyInventory inventory =
                pharmacyInventoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Pharmacy inventory not found"));

        Medicine medicine =
                medicineRepository.findById(request.getMedicineId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Medicine not found"));

        inventory.setMedicine(medicine);
        inventory.setQuantity(request.getQuantity());
        inventory.setMinimumStockLevel(
                request.getMinimumStockLevel());
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setExpiryDate(request.getExpiryDate());

        if (request.getReceivedDate() != null) {
            inventory.setReceivedDate(request.getReceivedDate());
        }

        PharmacyInventory updatedInventory =
                pharmacyInventoryRepository.save(inventory);

        return convertToResponseDTO(updatedInventory);
    }


    // =========================
    // DELETE INVENTORY
    // =========================
    public void deleteInventory(Long id) {

        PharmacyInventory inventory =
                pharmacyInventoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Pharmacy inventory not found"));

        pharmacyInventoryRepository.delete(inventory);
    }


    // =========================
    // GET LOW STOCK
    // =========================
    public List<PharmacyInventoryResponseDTO> getLowStockInventory() {

        return pharmacyInventoryRepository.findAll()
                .stream()
                .filter(inventory ->
                        inventory.getQuantity()
                                <= inventory.getMinimumStockLevel())
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // =========================
    // GET EXPIRED INVENTORY
    // =========================
    public List<PharmacyInventoryResponseDTO> getExpiredInventory() {

        LocalDate today = LocalDate.now();

        return pharmacyInventoryRepository.findAll()
                .stream()
                .filter(inventory ->
                        inventory.getExpiryDate() != null
                                && inventory.getExpiryDate().isBefore(today))
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // =========================
    // CONVERT ENTITY TO DTO
    // =========================
    private PharmacyInventoryResponseDTO convertToResponseDTO(
            PharmacyInventory inventory) {

        PharmacyInventoryResponseDTO response =
                new PharmacyInventoryResponseDTO();

        response.setId(inventory.getId());

        response.setMedicineId(
                inventory.getMedicine().getId()
        );

        response.setMedicineName(
                inventory.getMedicine().getName()
        );

        response.setQuantity(
                inventory.getQuantity()
        );

        response.setMinimumStockLevel(
                inventory.getMinimumStockLevel()
        );

        response.setBatchNumber(
                inventory.getBatchNumber()
        );

        response.setExpiryDate(
                inventory.getExpiryDate()
        );

        response.setReceivedDate(
                inventory.getReceivedDate()
        );

        response.setLowStock(
                inventory.getQuantity()
                        <= inventory.getMinimumStockLevel()
        );

        response.setExpired(
                inventory.getExpiryDate() != null
                        && inventory.getExpiryDate().isBefore(LocalDate.now())
        );

        return response;
    }
}