package com.expensetracker.validation;

import com.expensetracker.dto.ExpenseRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Programmatic validator providing cross-field business-rule validation for
 * {@link ExpenseRequest} that goes beyond what Jakarta Bean Validation annotations
 * can express.
 *
 * <p>This class complements — not replaces — the annotation-based constraints.</p>
 */
@Component
public class ExpenseValidator {

    /**
     * Validates cross-field rules on an {@link ExpenseRequest}.
     *
     * @param request the request to validate
     * @return a list of error messages; empty if the request is valid
     */
    public List<String> validate(ExpenseRequest request) {
        List<String> errors = new ArrayList<>();

        if (request.getExpenseDate() != null
                && request.getExpenseDate().isAfter(LocalDate.now())) {
            errors.add("Expense date cannot be in the future");
        }

        if (request.getAmount() != null && request.getAmount().scale() > 2) {
            errors.add("Amount must not have more than 2 decimal places");
        }

        return errors;
    }
}
