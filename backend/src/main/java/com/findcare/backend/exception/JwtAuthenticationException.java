package com.findcare.backend.exception;

public class JwtAuthenticationException extends RuntimeException {
    private final String code;

    public JwtAuthenticationException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
