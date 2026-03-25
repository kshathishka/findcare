package com.findcare.backend.repository;

import com.findcare.backend.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    Page<Doctor> findByDepartmentId(Long departmentId, Pageable pageable);
    List<Doctor> findByIsAvailable(Boolean isAvailable);
    
    @Query("SELECT d FROM Doctor d WHERE d.department.hospital.id = :hospitalId")
    Page<Doctor> findByHospitalId(@Param("hospitalId") Long hospitalId, Pageable pageable);
    
    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.user.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Doctor> searchDoctors(@Param("keyword") String keyword, Pageable pageable);
}
