package com.findcare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String error;
    private String code;
    private Map<String, String> validationErrors;

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Request processed successfully", data);
    }

    public static <T> ApiResponse<T> error(String error, String code) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setError(error);
        response.setCode(code);
        return response;
    }

    public static <T> ApiResponse<T> validationError(String error, Map<String, String> fieldErrors) {
        ApiResponse<T> response = error(error, "VALIDATION_ERROR");
        response.setValidationErrors(fieldErrors);
        return response;
    }
}
