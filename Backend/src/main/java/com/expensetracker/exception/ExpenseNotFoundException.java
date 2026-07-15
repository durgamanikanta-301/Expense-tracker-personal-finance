package com.expensetracker.exception;

/**
 * Thrown when an {@link com.expensetracker.entity.Expense} cannot be found.
 */
public class ExpenseNotFoundException extends ResourceNotFoundException {

    public ExpenseNotFoundException(Long id) {
        super("Expense not found with id: " + id);
    }
}
