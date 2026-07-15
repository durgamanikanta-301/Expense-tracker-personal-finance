package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Budget} persistence operations.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdOrderByBudgetYearDescBudgetMonthDesc(Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    List<Budget> findByUserIdAndBudgetYearAndBudgetMonth(Long userId, int year, int month);

    List<Budget> findByUserIdAndCategory(Long userId, Category category);

    boolean existsByUserIdAndCategoryAndBudgetYearAndBudgetMonth(
            Long userId, Category category, int year, int month);
}
