package com.findcare.backend.service;

import com.findcare.backend.dto.HospitalRequest;
import com.findcare.backend.dto.HospitalResponse;
import com.findcare.backend.entity.Hospital;
import com.findcare.backend.entity.HospitalType;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HospitalService {
    
    private final HospitalRepository hospitalRepository;
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public HospitalResponse createHospital(HospitalRequest request) {
        Hospital hospital = new Hospital();
        mapRequestToEntity(request, hospital);
        Hospital savedHospital = hospitalRepository.save(hospital);
        return mapEntityToResponse(savedHospital);
    }
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public HospitalResponse updateHospital(Long id, HospitalRequest request) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        
        mapRequestToEntity(request, hospital);
        Hospital updatedHospital = hospitalRepository.save(hospital);
        return mapEntityToResponse(updatedHospital);
    }
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        hospitalRepository.delete(hospital);
    }
    
    @PreAuthorize("permitAll()")
    public HospitalResponse getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return mapEntityToResponse(hospital);
    }
    
    @PreAuthorize("permitAll()")
    public Page<HospitalResponse> getAllHospitals(Pageable pageable) {
        return hospitalRepository.findAll(pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<HospitalResponse> getHospitalsByType(HospitalType type, Pageable pageable) {
        return hospitalRepository.findByType(type, pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<HospitalResponse> searchHospitals(String keyword, Pageable pageable) {
        return hospitalRepository.searchHospitals(keyword, pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<HospitalResponse> getHospitalsByCity(String city, Pageable pageable) {
        return hospitalRepository.findByCity(city, pageable).map(this::mapEntityToResponse);
    }
    
    private void mapRequestToEntity(HospitalRequest request, Hospital hospital) {
        hospital.setName(request.getName());
        hospital.setAddress(request.getAddress());
        hospital.setCity(request.getCity());
        hospital.setState(request.getState());
        hospital.setZipCode(request.getZipCode());
        hospital.setType(request.getType());
        hospital.setRating(request.getRating());
        hospital.setLatitude(request.getLatitude());
        hospital.setLongitude(request.getLongitude());
        hospital.setPhone(request.getPhone());
        hospital.setEmail(request.getEmail());
        hospital.setDescription(request.getDescription());
        hospital.setImageUrl(request.getImageUrl());
    }
    
    private HospitalResponse mapEntityToResponse(Hospital hospital) {
        HospitalResponse response = new HospitalResponse();
        response.setId(hospital.getId());
        response.setName(hospital.getName());
        response.setAddress(hospital.getAddress());
        response.setCity(hospital.getCity());
        response.setState(hospital.getState());
        response.setZipCode(hospital.getZipCode());
        response.setType(hospital.getType());
        response.setRating(hospital.getRating());
        response.setLatitude(hospital.getLatitude());
        response.setLongitude(hospital.getLongitude());
        response.setPhone(hospital.getPhone());
        response.setEmail(hospital.getEmail());
        response.setDescription(hospital.getDescription());
        response.setImageUrl(hospital.getImageUrl());
        response.setCreatedAt(hospital.getCreatedAt());
        return response;
    }
}
