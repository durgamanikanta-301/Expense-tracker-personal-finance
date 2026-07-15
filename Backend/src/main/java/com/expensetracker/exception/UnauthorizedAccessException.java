package com.expensetracker.exception;

/**
 * Thrown when an authenticated user attempts to access a resource that belongs to another user.
 */
public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException(String message) {
        super(message);
    }
}
