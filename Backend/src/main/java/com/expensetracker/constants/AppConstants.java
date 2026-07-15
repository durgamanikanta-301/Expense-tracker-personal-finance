package com.expensetracker.constants;

/**
 * Application-wide constants.
 *
 * <p>Centralises all magic strings and numeric constants to avoid duplication
 * and reduce the risk of typos scattered throughout the codebase.</p>
 */
public final class AppConstants {

    private AppConstants() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    // -----------------------------------------------------------------------
    // API Routes
    // -----------------------------------------------------------------------
    public static final String API_PREFIX       = "/api";
    public static final String AUTH_PREFIX      = API_PREFIX + "/auth";
    public static final String EXPENSE_PREFIX   = API_PREFIX + "/expenses";
    public static final String BUDGET_PREFIX    = API_PREFIX + "/budgets";
    public static final String BILL_PREFIX      = API_PREFIX + "/bills";
    public static final String SAVINGS_PREFIX   = API_PREFIX + "/savings-goals";
    public static final String DASHBOARD_PREFIX = API_PREFIX + "/dashboard";

    // -----------------------------------------------------------------------
    // JWT / Security
    // -----------------------------------------------------------------------
    public static final String BEARER_PREFIX        = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    // -----------------------------------------------------------------------
    // Pagination defaults
    // -----------------------------------------------------------------------
    public static final int    DEFAULT_PAGE_NUMBER = 0;
    public static final int    DEFAULT_PAGE_SIZE   = 10;
    public static final String DEFAULT_SORT_BY     = "createdAt";
    public static final String DEFAULT_SORT_DIR    = "desc";

    // -----------------------------------------------------------------------
    // Validation messages
    // -----------------------------------------------------------------------
    public static final String EMAIL_REQUIRED      = "Email is required";
    public static final String PASSWORD_REQUIRED   = "Password is required";
    public static final String FIRST_NAME_REQUIRED = "First name is required";
    public static final String LAST_NAME_REQUIRED  = "Last name is required";
    public static final String AMOUNT_POSITIVE     = "Amount must be greater than zero";
    public static final String TITLE_REQUIRED      = "Title is required";
    public static final String CATEGORY_REQUIRED   = "Category is required";
    public static final String TYPE_REQUIRED       = "Transaction type is required";
    public static final String DATE_REQUIRED       = "Date is required";
}
