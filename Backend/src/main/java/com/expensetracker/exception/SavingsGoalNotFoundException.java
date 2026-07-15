package com.expensetracker.exception;

/**
 * Thrown when a {@link com.expensetracker.entity.SavingsGoal} cannot be found.
 */
public class SavingsGoalNotFoundException extends ResourceNotFoundException {

    public SavingsGoalNotFoundException(Long id) {
        super("Savings goal not found with id: " + id);
    }
}
