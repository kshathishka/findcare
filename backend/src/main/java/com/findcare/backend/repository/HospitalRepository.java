package com.findcare.backend.repository;

import com.findcare.backend.entity.Hospital;
import com.findcare.backend.entity.HospitalType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
       Page<Hospital> findByType(HospitalType type, Pageable pageable);
       Page<Hospital> findByCity(String city, Pageable pageable);
    List<Hospital> findByState(String state);
    
    @Query("SELECT h FROM Hospital h WHERE " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Hospital> searchHospitals(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT h FROM Hospital h WHERE h.type = :type AND " +
           "(LOWER(h.city) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
           "LOWER(h.state) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Hospital> findByTypeAndLocation(@Param("type") HospitalType type, @Param("location") String location);
}
