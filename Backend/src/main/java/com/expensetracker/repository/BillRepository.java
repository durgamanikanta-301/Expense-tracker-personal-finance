package com.expensetracker.repository;

import com.expensetracker.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Bill} persistence operations.
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByUserIdOrderByNextDueDateAsc(Long userId);

    Optional<Bill> findByIdAndUserId(Long id, Long userId);

    List<Bill> findByUserIdAndIsPaidFalseOrderByNextDueDateAsc(Long userId);

    List<Bill> findByUserIdAndIsPaidTrue(Long userId);

    @Query("""
            SELECT b FROM Bill b
            WHERE b.user.id = :userId
              AND b.isPaid = false
              AND b.nextDueDate BETWEEN :startDate AND :endDate
            ORDER BY b.nextDueDate ASC
            """)
    List<Bill> findUpcomingBills(
            @Param("userId")    Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate);
}
