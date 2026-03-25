package com.findcare.backend.repository;

import com.findcare.backend.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByDoctorId(Long doctorId);
    List<TimeSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    List<TimeSlot> findByDoctorIdAndIsAvailable(Long doctorId, Boolean isAvailable);
    
    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId AND " +
           "t.date >= :startDate AND t.date <= :endDate AND t.isAvailable = true")
    List<TimeSlot> findAvailableSlotsByDoctorAndDateRange(
        @Param("doctorId") Long doctorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
