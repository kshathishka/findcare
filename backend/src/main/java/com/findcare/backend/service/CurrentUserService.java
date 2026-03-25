package com.findcare.backend.service;

import com.findcare.backend.entity.User;
import com.findcare.backend.exception.ResourceNotFoundException;
import com.findcare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public Long getUserIdByEmail(String email) {
        return getByEmail(email).getId();
    }
}
