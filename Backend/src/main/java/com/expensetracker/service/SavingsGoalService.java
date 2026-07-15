package com.expensetracker.service;

import com.expensetracker.dto.SavingsGoalRequest;
import com.expensetracker.dto.SavingsGoalResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Contract for savings goal CRUD and tracking operations.
 */
public interface SavingsGoalService {

    SavingsGoalResponse createGoal(SavingsGoalRequest request);

    SavingsGoalResponse getGoalById(Long id);

    List<SavingsGoalResponse> getAllGoals();

    List<SavingsGoalResponse> getActiveGoals();

    List<SavingsGoalResponse> getCompletedGoals();

    SavingsGoalResponse updateGoal(Long id, SavingsGoalRequest request);

    SavingsGoalResponse addContribution(Long id, BigDecimal amount);

    void deleteGoal(Long id);
}
