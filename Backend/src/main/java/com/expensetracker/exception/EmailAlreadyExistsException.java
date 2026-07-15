package com.expensetracker.exception;

/**
 * Thrown when a registration attempt uses an email that is already registered.
 */
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Email already registered: " + email);
    }
}
