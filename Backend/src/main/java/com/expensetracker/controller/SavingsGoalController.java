package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.SavingsGoalRequest;
import com.expensetracker.dto.SavingsGoalResponse;
import com.expensetracker.service.SavingsGoalService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller for savings goal CRUD and contribution tracking endpoints.
 */
@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> createGoal(
            @Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsGoalService.createGoal(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getAllGoals() {
        return ResponseEntity.ok(ApiResponse.success(savingsGoalService.getAllGoals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(savingsGoalService.getGoalById(id)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getActiveGoals() {
        return ResponseEntity.ok(ApiResponse.success(savingsGoalService.getActiveGoals()));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getCompletedGoals() {
        return ResponseEntity.ok(ApiResponse.success(savingsGoalService.getCompletedGoals()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsGoalService.updateGoal(id, request);
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", response));
    }

    @PatchMapping("/{id}/contribute")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> addContribution(
            @PathVariable Long id,
            @RequestParam @Positive(message = "Contribution amount must be positive") BigDecimal amount) {
        SavingsGoalResponse response = savingsGoalService.addContribution(id, amount);
        return ResponseEntity.ok(ApiResponse.success("Contribution added successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
        return ResponseEntity.ok(ApiResponse.success("Savings goal deleted successfully"));
    }
}
