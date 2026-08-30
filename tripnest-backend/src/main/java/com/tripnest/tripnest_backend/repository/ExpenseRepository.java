package com.tripnest.tripnest_backend.repository;

import com.tripnest.tripnest_backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findByTripId(Integer tripId);

    @Query("""
            SELECT e.category, SUM(e.amount)
            FROM Expense e
            WHERE e.trip.id = :tripId
            GROUP BY e.category
            """)
    List<Object[]> getCategorySummary(@Param("tripId") Integer tripId);

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.trip.id = :tripId
            """)
    BigDecimal getTotalExpensesByTripId(@Param("tripId") Integer tripId);
}