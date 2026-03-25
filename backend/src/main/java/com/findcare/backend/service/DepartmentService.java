package com.findcare.backend.service;

import com.findcare.backend.dto.DepartmentRequest;
import com.findcare.backend.dto.DepartmentResponse;
import com.findcare.backend.entity.Department;
import com.findcare.backend.entity.Hospital;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.repository.DepartmentRepository;
import com.findcare.backend.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final HospitalRepository hospitalRepository;

    @PreAuthorize("permitAll()")
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::mapEntityToResponse).toList();
    }

    @PreAuthorize("permitAll()")
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapEntityToResponse(department);
    }

    @PreAuthorize("permitAll()")
    public List<DepartmentResponse> getDepartmentsByHospital(Long hospitalId) {
        return departmentRepository.findByHospitalId(hospitalId).stream().map(this::mapEntityToResponse).toList();
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + request.getHospitalId()));

        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setHospital(hospital);

        Department savedDepartment = departmentRepository.save(department);
        return mapEntityToResponse(savedDepartment);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        if (request.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + request.getHospitalId()));
            department.setHospital(hospital);
        }

        Department updatedDepartment = departmentRepository.save(department);
        return mapEntityToResponse(updatedDepartment);
    }

    @Transactional
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.delete(department);
    }

    private DepartmentResponse mapEntityToResponse(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getHospital().getId(),
                department.getHospital().getName()
        );
    }
}
