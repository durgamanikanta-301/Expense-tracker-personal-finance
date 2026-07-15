package com.expensetracker.exception;

/**
 * Thrown when a {@link com.expensetracker.entity.Budget} cannot be found.
 */
public class BudgetNotFoundException extends ResourceNotFoundException {

    public BudgetNotFoundException(Long id) {
        super("Budget not found with id: " + id);
    }
}
