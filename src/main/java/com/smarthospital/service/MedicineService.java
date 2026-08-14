package com.smarthospital.service;

import com.smarthospital.dto.MedicineRequestDTO;
import com.smarthospital.dto.MedicineResponseDTO;
import com.smarthospital.entity.Medicine;
import com.smarthospital.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // Create Medicine
    public MedicineResponseDTO createMedicine(MedicineRequestDTO request) {

        Medicine medicine = new Medicine();

        medicine.setName(request.getName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(request.getCategory());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setPrice(request.getPrice());
        medicine.setStockQuantity(request.getStockQuantity());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setDescription(request.getDescription());

        if (request.getActive() != null) {
            medicine.setActive(request.getActive());
        } else {
            medicine.setActive(true);
        }

        Medicine savedMedicine = medicineRepository.save(medicine);

        return convertToResponse(savedMedicine);
    }

    // Get All Medicines
    public List<MedicineResponseDTO> getAllMedicines() {

        return medicineRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get Medicine By ID
    public MedicineResponseDTO getMedicineById(Long id) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with ID: " + id
                        ));

        return convertToResponse(medicine);
    }

    // Update Medicine
    public MedicineResponseDTO updateMedicine(
            Long id,
            MedicineRequestDTO request) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with ID: " + id
                        ));

        medicine.setName(request.getName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(request.getCategory());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setPrice(request.getPrice());
        medicine.setStockQuantity(request.getStockQuantity());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setDescription(request.getDescription());

        if (request.getActive() != null) {
            medicine.setActive(request.getActive());
        }

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return convertToResponse(updatedMedicine);
    }

    // Delete Medicine
    public void deleteMedicine(Long id) {

        if (!medicineRepository.existsById(id)) {
            throw new RuntimeException(
                    "Medicine not found with ID: " + id
            );
        }

        medicineRepository.deleteById(id);
    }

    // Convert Entity to Response DTO
    private MedicineResponseDTO convertToResponse(Medicine medicine) {

        MedicineResponseDTO response = new MedicineResponseDTO();

        response.setId(medicine.getId());
        response.setName(medicine.getName());
        response.setGenericName(medicine.getGenericName());
        response.setCategory(medicine.getCategory());
        response.setManufacturer(medicine.getManufacturer());
        response.setPrice(medicine.getPrice());
        response.setStockQuantity(medicine.getStockQuantity());
        response.setExpiryDate(medicine.getExpiryDate());
        response.setDescription(medicine.getDescription());
        response.setActive(medicine.getActive());

        return response;
    }
}