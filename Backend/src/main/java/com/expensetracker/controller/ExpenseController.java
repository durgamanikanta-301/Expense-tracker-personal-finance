package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for expense CRUD and filtering endpoints.
 *
 * <p>All endpoints require a valid JWT. The authenticated user is resolved from
 * the security context inside the service layer — no userId path parameters needed.</p>
 */
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    /** Creates a new expense. */
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense created successfully", response));
    }

    /** Returns all expenses for the authenticated user. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses() {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getAllExpenses()));
    }

    /** Returns a single expense by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpenseById(id)));
    }

    /** Updates an existing expense. */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", response));
    }

    /** Deletes an expense. */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully"));
    }

    /** Filters expenses by transaction type (INCOME or EXPENSE). */
    @GetMapping("/filter/type")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getByType(
            @RequestParam TransactionType type) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpensesByType(type)));
    }

    /** Filters expenses by category. */
    @GetMapping("/filter/category")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getByCategory(
            @RequestParam Category category) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpensesByCategory(category)));
    }

    /** Filters expenses by date range. */
    @GetMapping("/filter/date")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                expenseService.getExpensesByDateRange(startDate, endDate)));
    }

    /** Filters expenses by month and year. */
    @GetMapping("/filter/month")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(
                expenseService.getExpensesByMonthAndYear(month, year)));
    }

    /** Filters expenses by year. */
    @GetMapping("/filter/year")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getByYear(
            @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpensesByYear(year)));
    }
}
