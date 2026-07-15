package com.expensetracker.service;

import com.expensetracker.dto.SavingsGoalRequest;
import com.expensetracker.dto.SavingsGoalResponse;
import com.expensetracker.entity.SavingsGoal;
import com.expensetracker.entity.User;
import com.expensetracker.exception.SavingsGoalNotFoundException;
import com.expensetracker.mapper.SavingsGoalMapper;
import com.expensetracker.repository.SavingsGoalRepository;
import com.expensetracker.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link SavingsGoalService}.
 */
@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsGoalMapper     savingsGoalMapper;

    public SavingsGoalServiceImpl(SavingsGoalRepository savingsGoalRepository,
                                   SavingsGoalMapper savingsGoalMapper) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.savingsGoalMapper     = savingsGoalMapper;
    }

    @Override
    @Transactional
    public SavingsGoalResponse createGoal(SavingsGoalRequest request) {
        User currentUser  = SecurityUtils.getCurrentUser();
        SavingsGoal goal  = savingsGoalMapper.toEntity(request, currentUser);
        SavingsGoal saved = savingsGoalRepository.save(goal);
        return savingsGoalMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SavingsGoalResponse getGoalById(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new SavingsGoalNotFoundException(id));
        return savingsGoalMapper.toResponse(goal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavingsGoalResponse> getAllGoals() {
        Long userId = SecurityUtils.getCurrentUserId();
        return savingsGoalRepository.findByUserIdOrderByDeadlineAsc(userId)
                .stream()
                .map(savingsGoalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavingsGoalResponse> getActiveGoals() {
        Long userId = SecurityUtils.getCurrentUserId();
        return savingsGoalRepository.findByUserIdAndIsCompleted(userId, false)
                .stream()
                .map(savingsGoalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavingsGoalResponse> getCompletedGoals() {
        Long userId = SecurityUtils.getCurrentUserId();
        return savingsGoalRepository.findByUserIdAndIsCompleted(userId, true)
                .stream()
                .map(savingsGoalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SavingsGoalResponse updateGoal(Long id, SavingsGoalRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new SavingsGoalNotFoundException(id));
        savingsGoalMapper.updateEntity(goal, request);
        SavingsGoal updated = savingsGoalRepository.save(goal);
        return savingsGoalMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public SavingsGoalResponse addContribution(Long id, BigDecimal amount) {
        Long userId = SecurityUtils.getCurrentUserId();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new SavingsGoalNotFoundException(id));

        BigDecimal newSaved = goal.getSavedAmount().add(amount);
        goal.setSavedAmount(newSaved);

        // Auto-mark complete when target is reached
        if (newSaved.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setCompleted(true);
        }

        SavingsGoal saved = savingsGoalRepository.save(goal);
        return savingsGoalMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteGoal(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new SavingsGoalNotFoundException(id));
        savingsGoalRepository.delete(goal);
    }
}
