package com.findcare.backend.service;

import com.findcare.backend.dto.DoctorRequest;
import com.findcare.backend.dto.DoctorResponse;
import com.findcare.backend.entity.Department;
import com.findcare.backend.entity.Doctor;
import com.findcare.backend.entity.User;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.repository.DepartmentRepository;
import com.findcare.backend.repository.DoctorRepository;
import com.findcare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public DoctorResponse createDoctor(DoctorRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        Department department = departmentRepository.findById(request.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setDepartment(department);
        mapRequestToEntity(request, doctor);
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapEntityToResponse(savedDoctor);
    }
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
            doctor.setDepartment(department);
        }
        
        mapRequestToEntity(request, doctor);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return mapEntityToResponse(updatedDoctor);
    }
    
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }
    
    @PreAuthorize("permitAll()")
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapEntityToResponse(doctor);
    }
    
    @PreAuthorize("permitAll()")
    public Page<DoctorResponse> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<DoctorResponse> getDoctorsByDepartment(Long departmentId, Pageable pageable) {
        return doctorRepository.findByDepartmentId(departmentId, pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<DoctorResponse> getDoctorsByHospital(Long hospitalId, Pageable pageable) {
        return doctorRepository.findByHospitalId(hospitalId, pageable).map(this::mapEntityToResponse);
    }
    
    @PreAuthorize("permitAll()")
    public Page<DoctorResponse> searchDoctors(String keyword, Pageable pageable) {
        return doctorRepository.searchDoctors(keyword, pageable).map(this::mapEntityToResponse);
    }
    
    private void mapRequestToEntity(DoctorRequest request, Doctor doctor) {
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setYearsOfExperience(request.getYearsOfExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setBio(request.getBio());
        doctor.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getIsAvailable() != null) {
            doctor.setIsAvailable(request.getIsAvailable());
        }
    }
    
    private DoctorResponse mapEntityToResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setUserId(doctor.getUser().getId());
        response.setDoctorName(doctor.getUser().getName());
        response.setEmail(doctor.getUser().getEmail());
        response.setPhone(doctor.getUser().getPhone());
        response.setDepartmentId(doctor.getDepartment().getId());
        response.setDepartmentName(doctor.getDepartment().getName());
        response.setHospitalId(doctor.getDepartment().getHospital().getId());
        response.setHospitalName(doctor.getDepartment().getHospital().getName());
        response.setSpecialization(doctor.getSpecialization());
        response.setQualification(doctor.getQualification());
        response.setYearsOfExperience(doctor.getYearsOfExperience());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setLicenseNumber(doctor.getLicenseNumber());
        response.setBio(doctor.getBio());
        response.setProfileImageUrl(doctor.getProfileImageUrl());
        response.setIsAvailable(doctor.getIsAvailable());
        return response;
    }
}
