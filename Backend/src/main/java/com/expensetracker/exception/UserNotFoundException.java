package com.expensetracker.exception;

/**
 * Thrown when a {@link com.expensetracker.entity.User} cannot be found.
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}
