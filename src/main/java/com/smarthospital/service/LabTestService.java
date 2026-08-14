package com.smarthospital.service;

import com.smarthospital.dto.LabTestRequestDTO;
import com.smarthospital.dto.LabTestResponseDTO;
import com.smarthospital.entity.LabTest;
import com.smarthospital.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabTestService {

    @Autowired
    private LabTestRepository labTestRepository;

    public LabTestResponseDTO createLabTest(LabTestRequestDTO request) {

        LabTest labTest = new LabTest();

        labTest.setTestName(request.getTestName());
        labTest.setCategory(request.getCategory());
        labTest.setPrice(request.getPrice());
        labTest.setNormalRange(request.getNormalRange());
        labTest.setDescription(request.getDescription());

        LabTest saved = labTestRepository.save(labTest);

        return convertToDTO(saved);
    }

    public List<LabTestResponseDTO> getAllLabTests() {

        return labTestRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LabTestResponseDTO getLabTestById(Long id) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Test not found"));

        return convertToDTO(labTest);
    }

    public LabTestResponseDTO updateLabTest(Long id, LabTestRequestDTO request) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Test not found"));

        labTest.setTestName(request.getTestName());
        labTest.setCategory(request.getCategory());
        labTest.setPrice(request.getPrice());
        labTest.setNormalRange(request.getNormalRange());
        labTest.setDescription(request.getDescription());

        LabTest updated = labTestRepository.save(labTest);

        return convertToDTO(updated);
    }

    public void deleteLabTest(Long id) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Test not found"));

        labTestRepository.delete(labTest);
    }

    private LabTestResponseDTO convertToDTO(LabTest labTest) {

        LabTestResponseDTO dto = new LabTestResponseDTO();

        dto.setId(labTest.getId());
        dto.setTestName(labTest.getTestName());
        dto.setCategory(labTest.getCategory());
        dto.setPrice(labTest.getPrice());
        dto.setNormalRange(labTest.getNormalRange());
        dto.setDescription(labTest.getDescription());

        return dto;
    }
}