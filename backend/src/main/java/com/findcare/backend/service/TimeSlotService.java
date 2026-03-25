package com.findcare.backend.service;

import com.findcare.backend.dto.TimeSlotRequest;
import com.findcare.backend.entity.Doctor;
import com.findcare.backend.entity.TimeSlot;
import com.findcare.backend.exception.BadRequestException;
import com.findcare.backend.exception.ConflictException;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.repository.DoctorRepository;
import com.findcare.backend.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    
    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public TimeSlot createTimeSlot(TimeSlotRequest request) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
        
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setDoctor(doctor);
        timeSlot.setDate(request.getDate());
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        timeSlot.setMaxPatients(request.getMaxPatients() != null ? request.getMaxPatients() : 1);
        timeSlot.setBookedPatients(0);
        timeSlot.setIsAvailable(true);
        
        return timeSlotRepository.save(timeSlot);
    }
    
    @PreAuthorize("permitAll()")
    @Transactional
    public List<TimeSlot> getAvailableSlots(Long doctorId, LocalDate date) {
        List<TimeSlot> slots = timeSlotRepository.findByDoctorIdAndDate(doctorId, date);
        expirePastSlots(slots);
        return slots.stream().filter(TimeSlot::getIsAvailable).toList();
    }
    
    @PreAuthorize("permitAll()")
    @Transactional
    public List<TimeSlot> getDoctorTimeSlots(Long doctorId) {
        List<TimeSlot> slots = timeSlotRepository.findByDoctorId(doctorId);
        expirePastSlots(slots);
        return slots;
    }
    
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public void deleteTimeSlot(Long timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
            .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id: " + timeSlotId));
        
        if (timeSlot.getBookedPatients() > 0) {
            throw new ConflictException("Cannot delete time slot with booked appointments");
        }
        
        timeSlotRepository.delete(timeSlot);
    }

    @Transactional
    protected void expirePastSlots(List<TimeSlot> slots) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        boolean changed = false;

        for (TimeSlot slot : slots) {
            boolean isPastDate = slot.getDate().isBefore(today);
            boolean isPastToday = slot.getDate().isEqual(today) && slot.getEndTime().isBefore(now);
            if ((isPastDate || isPastToday) && Boolean.TRUE.equals(slot.getIsAvailable())) {
                slot.setIsAvailable(false);
                changed = true;
            }
        }

        if (changed) {
            timeSlotRepository.saveAll(slots);
        }
    }
}
