package com.findcare.backend.repository;

import com.findcare.backend.entity.Appointment;
import com.findcare.backend.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    boolean existsByTimeSlotIdAndStatusIn(Long timeSlotId, List<AppointmentStatus> statuses);
    
    @Query("SELECT a FROM Appointment a WHERE a.timeSlot.date = :date")
    Page<Appointment> findByDate(@Param("date") LocalDate date, Pageable pageable);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.timeSlot.date = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.timeSlot.date = :date AND a.status = :status")
    List<Appointment> findByDateAndStatus(@Param("date") LocalDate date, @Param("status") AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE " +
           "LOWER(a.patient.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.patient.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Appointment> searchByPatientInfo(@Param("keyword") String keyword, Pageable pageable);
}
