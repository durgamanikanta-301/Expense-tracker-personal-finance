package com.expensetracker.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardised JSON error response returned by the {@link GlobalExceptionHandler}.
 */
public class ErrorResponse {

    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final LocalDateTime timestamp;
    private final Map<String, String> errors;

    public ErrorResponse(int status, String error, String message, String path) {
        this.status    = status;
        this.error     = error;
        this.message   = message;
        this.path      = path;
        this.timestamp = LocalDateTime.now();
        this.errors    = null;
    }

    public ErrorResponse(int status, String error, String message, String path,
                         Map<String, String> errors) {
        this.status    = status;
        this.error     = error;
        this.message   = message;
        this.path      = path;
        this.timestamp = LocalDateTime.now();
        this.errors    = errors;
    }

    public int getStatus()              { return status; }
    public String getError()            { return error; }
    public String getMessage()          { return message; }
    public String getPath()             { return path; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Map<String, String> getErrors() { return errors; }
}
