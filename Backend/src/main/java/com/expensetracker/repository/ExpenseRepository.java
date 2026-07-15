package com.expensetracker.repository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Expense} persistence and query operations.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    List<Expense> findByUserIdAndTransactionTypeOrderByExpenseDateDesc(Long userId, TransactionType type);

    List<Expense> findByUserIdAndCategoryOrderByExpenseDateDesc(Long userId, Category category);

    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    @Query("""
            SELECT e FROM Expense e
            WHERE e.user.id = :userId
              AND FUNCTION('MONTH', e.expenseDate) = :month
              AND FUNCTION('YEAR',  e.expenseDate) = :year
            ORDER BY e.expenseDate DESC
            """)
    List<Expense> findByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month")  int month,
            @Param("year")   int year);

    @Query("""
            SELECT e FROM Expense e
            WHERE e.user.id = :userId
              AND FUNCTION('YEAR', e.expenseDate) = :year
            ORDER BY e.expenseDate DESC
            """)
    List<Expense> findByUserIdAndYear(
            @Param("userId") Long userId,
            @Param("year")   int year);

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user.id = :userId
              AND e.transactionType = :type
            """)
    BigDecimal sumAmountByUserIdAndType(
            @Param("userId") Long userId,
            @Param("type")   TransactionType type);

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user.id = :userId
              AND e.transactionType = :type
              AND FUNCTION('MONTH', e.expenseDate) = :month
              AND FUNCTION('YEAR',  e.expenseDate) = :year
            """)
    BigDecimal sumAmountByUserIdAndTypeAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("type")   TransactionType type,
            @Param("month")  int month,
            @Param("year")   int year);

    @Query("""
            SELECT e.category, COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user.id = :userId
              AND e.transactionType = 'EXPENSE'
              AND FUNCTION('MONTH', e.expenseDate) = :month
              AND FUNCTION('YEAR',  e.expenseDate) = :year
            GROUP BY e.category
            """)
    List<Object[]> sumExpenseByCategory(
            @Param("userId") Long userId,
            @Param("month")  int month,
            @Param("year")   int year);

    @Query(value = """
            SELECT * FROM expenses e
            WHERE e.user_id = :userId
            ORDER BY e.created_at DESC
            LIMIT :limitCount
            """, nativeQuery = true)
    List<Expense> findRecentByUserId(
            @Param("userId")     Long userId,
            @Param("limitCount") int limitCount);
}
