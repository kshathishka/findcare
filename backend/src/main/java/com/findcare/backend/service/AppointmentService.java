package com.findcare.backend.service;

import com.findcare.backend.dto.AppointmentRequest;
import com.findcare.backend.dto.AppointmentResponse;
import com.findcare.backend.entity.Appointment;
import com.findcare.backend.entity.AppointmentStatus;
import com.findcare.backend.entity.Doctor;
import com.findcare.backend.entity.TimeSlot;
import com.findcare.backend.entity.User;
import com.findcare.backend.exception.BadRequestException;
import com.findcare.backend.exception.ConflictException;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.exception.UnauthorizedException;
import com.findcare.backend.repository.AppointmentRepository;
import com.findcare.backend.repository.DoctorRepository;
import com.findcare.backend.repository.TimeSlotRepository;
import com.findcare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository timeSlotRepository;

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> VALID_TRANSITIONS = Map.of(
            AppointmentStatus.SCHEDULED, Set.of(AppointmentStatus.CANCELLED, AppointmentStatus.CHECKED_IN),
            AppointmentStatus.CHECKED_IN, Set.of(AppointmentStatus.COMPLETED),
            AppointmentStatus.CANCELLED, Set.of(),
            AppointmentStatus.COMPLETED, Set.of()
    );

    @Transactional
    @PreAuthorize("hasAuthority('PATIENT')")
    public AppointmentResponse createAppointment(Long patientId, AppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id: " + request.getTimeSlotId()));

        if (!doctor.getId().equals(timeSlot.getDoctor().getId())) {
            throw new BadRequestException("Selected time slot does not belong to the selected doctor");
        }

        if (!Boolean.TRUE.equals(timeSlot.getIsAvailable())) {
            throw new ConflictException("Time slot is not available");
        }

        boolean alreadyBooked = appointmentRepository.existsByTimeSlotIdAndStatusIn(
                timeSlot.getId(),
                List.of(AppointmentStatus.SCHEDULED, AppointmentStatus.CHECKED_IN)
        );

        if (alreadyBooked) {
            throw new ConflictException("Time slot is already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setTimeSlot(timeSlot);
        appointment.setPatientNotes(request.getPatientNotes());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        timeSlot.setBookedPatients(timeSlot.getBookedPatients() + 1);
        if (timeSlot.getBookedPatients() >= timeSlot.getMaxPatients()) {
            timeSlot.setIsAvailable(false);
        }
        timeSlotRepository.save(timeSlot);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(savedAppointment);
    }

    @Transactional
    @PreAuthorize("hasAuthority('PATIENT')")
    public AppointmentResponse cancelAppointment(Long appointmentId, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        if (!appointment.getPatient().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized to cancel this appointment");
        }

        transitionOrThrow(appointment, AppointmentStatus.CANCELLED);

        TimeSlot timeSlot = appointment.getTimeSlot();
        timeSlot.setBookedPatients(Math.max(0, timeSlot.getBookedPatients() - 1));
        if (timeSlot.getBookedPatients() < timeSlot.getMaxPatients()) {
            timeSlot.setIsAvailable(true);
        }
        timeSlotRepository.save(timeSlot);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(updatedAppointment);
    }

    @Transactional
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public AppointmentResponse checkInAppointment(Long appointmentId, String receptionistName) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        transitionOrThrow(appointment, AppointmentStatus.CHECKED_IN);
        appointment.setCheckedInAt(LocalDateTime.now());
        appointment.setCheckedInBy(receptionistName);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(updatedAppointment);
    }

    @Transactional
    @PreAuthorize("hasAuthority('DOCTOR')")
    public AppointmentResponse completeAppointment(Long appointmentId, String doctorNotes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        transitionOrThrow(appointment, AppointmentStatus.COMPLETED);
        appointment.setDoctorNotes(doctorNotes);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(updatedAppointment);
    }

    @PreAuthorize("hasAuthority('PATIENT')")
    public Page<AppointmentResponse> getPatientAppointments(Long patientId, Pageable pageable) {
        return appointmentRepository.findByPatientId(patientId, pageable).map(this::mapEntityToResponse);
    }

    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public Page<AppointmentResponse> getDoctorAppointments(Long doctorId, Pageable pageable) {
        return appointmentRepository.findByDoctorId(doctorId, pageable).map(this::mapEntityToResponse);
    }

    @PreAuthorize("hasAnyAuthority('RECEPTIONIST', 'ADMIN')")
    public Page<AppointmentResponse> getTodayAppointments(Pageable pageable) {
        return appointmentRepository.findByDate(LocalDate.now(), pageable).map(this::mapEntityToResponse);
    }

    @PreAuthorize("hasAnyAuthority('RECEPTIONIST', 'ADMIN')")
    public Page<AppointmentResponse> searchAppointments(String keyword, Pageable pageable) {
        return appointmentRepository.searchByPatientInfo(keyword, pageable).map(this::mapEntityToResponse);
    }

    private void transitionOrThrow(Appointment appointment, AppointmentStatus targetStatus) {
        AppointmentStatus currentStatus = appointment.getStatus();
        Set<AppointmentStatus> allowedTargets = VALID_TRANSITIONS.getOrDefault(currentStatus, Set.of());
        if (!allowedTargets.contains(targetStatus)) {
            throw new BadRequestException("Invalid appointment status transition from " + currentStatus + " to " + targetStatus);
        }
        appointment.setStatus(targetStatus);
    }

    private AppointmentResponse mapEntityToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setPatientId(appointment.getPatient().getId());
        response.setPatientName(appointment.getPatient().getName());
        response.setPatientEmail(appointment.getPatient().getEmail());
        response.setPatientPhone(appointment.getPatient().getPhone());
        response.setDoctorId(appointment.getDoctor().getId());
        response.setDoctorName(appointment.getDoctor().getUser().getName());
        response.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        response.setTimeSlotId(appointment.getTimeSlot().getId());
        response.setAppointmentDate(appointment.getTimeSlot().getDate());
        response.setStartTime(appointment.getTimeSlot().getStartTime());
        response.setEndTime(appointment.getTimeSlot().getEndTime());
        response.setStatus(appointment.getStatus());
        response.setPatientNotes(appointment.getPatientNotes());
        response.setDoctorNotes(appointment.getDoctorNotes());
        response.setSymptoms(appointment.getSymptoms());
        response.setCheckedInAt(appointment.getCheckedInAt());
        response.setCheckedInBy(appointment.getCheckedInBy());
        response.setCreatedAt(appointment.getCreatedAt());
        return response;
    }
}
