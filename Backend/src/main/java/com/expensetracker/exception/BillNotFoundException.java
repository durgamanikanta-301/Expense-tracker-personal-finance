package com.expensetracker.exception;

/**
 * Thrown when a {@link com.expensetracker.entity.Bill} cannot be found.
 */
public class BillNotFoundException extends ResourceNotFoundException {

    public BillNotFoundException(Long id) {
        super("Bill not found with id: " + id);
    }
}
