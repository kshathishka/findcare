package com.findcare.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private final Map<String, AttemptWindow> attemptsByKey = new ConcurrentHashMap<>();

    @Value("${app.auth.rate-limit.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.auth.rate-limit.window-seconds:60}")
    private long windowSeconds;

    public boolean isAllowed(String key) {
        AttemptWindow window = attemptsByKey.computeIfAbsent(key, ignored -> new AttemptWindow());
        synchronized (window) {
            rotateWindowIfExpired(window);
            return window.attemptCount < maxAttempts;
        }
    }

    public void recordFailure(String key) {
        AttemptWindow window = attemptsByKey.computeIfAbsent(key, ignored -> new AttemptWindow());
        synchronized (window) {
            rotateWindowIfExpired(window);
            window.attemptCount++;
        }
    }

    public void recordSuccess(String key) {
        attemptsByKey.remove(key);
    }

    private void rotateWindowIfExpired(AttemptWindow window) {
        if (Duration.between(window.windowStart, Instant.now()).getSeconds() >= windowSeconds) {
            window.windowStart = Instant.now();
            window.attemptCount = 0;
        }
    }

    private static class AttemptWindow {
        private Instant windowStart = Instant.now();
        private int attemptCount = 0;
    }
}
