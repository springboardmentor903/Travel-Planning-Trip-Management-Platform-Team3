package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.entity.Budget;
import com.tripnest.tripnest_backend.entity.Expense;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.entity.User;
import com.tripnest.tripnest_backend.repository.BudgetRepository;
import com.tripnest.tripnest_backend.repository.ExpenseRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;
import com.tripnest.tripnest_backend.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            TripRepository tripRepository,
            BudgetRepository budgetRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.tripRepository = tripRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    // CREATE EXPENSE
    public Expense createExpense(Integer tripId, Expense expense) {

        if (expense.getAmount() == null ||
                expense.getAmount().compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException("Expense amount cannot be negative");
        }

        if (expense.getCategory() == null ||
                expense.getCategory().isBlank()) {

            throw new RuntimeException("Category is required");
        }

        if (expense.getDate() == null) {
            throw new RuntimeException("Date is required");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        Budget budget = budgetRepository.findByTripId(tripId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Budget not found for this trip"));

        User currentUser = getCurrentUser();

        /*
         * Check whether current user is the trip owner.
         */
        if (!trip.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException(
                    "You are not authorized to add expense to this trip");
        }

        expense.setTrip(trip);
        expense.setBudget(budget);
        expense.setPayer(currentUser);

        return expenseRepository.save(expense);
    }


    // LIST EXPENSES
    public List<Expense> getExpenses(Integer tripId) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        User currentUser = getCurrentUser();

        if (!trip.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException(
                    "You are not authorized to view these expenses");
        }

        return expenseRepository.findByTripId(tripId);
    }


    // UPDATE EXPENSE
    public Expense updateExpense(
            Integer expenseId,
            Expense updatedExpense) {

        if (updatedExpense.getAmount() == null ||
                updatedExpense.getAmount().compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Expense amount cannot be negative");
        }

        if (updatedExpense.getCategory() == null ||
                updatedExpense.getCategory().isBlank()) {

            throw new RuntimeException("Category is required");
        }

        Expense existingExpense =
                expenseRepository.findById(expenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found"));

        User currentUser = getCurrentUser();

        if (!existingExpense.getTrip()
                .getOwner()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this expense");
        }

        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDate(updatedExpense.getDate());
        existingExpense.setReceiptLink(
                updatedExpense.getReceiptLink());

        return expenseRepository.save(existingExpense);
    }


    // DELETE EXPENSE
    public void deleteExpense(Integer expenseId) {

        Expense expense =
                expenseRepository.findById(expenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found"));

        User currentUser = getCurrentUser();

        if (!expense.getTrip()
                .getOwner()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not authorized to delete this expense");
        }

        expenseRepository.delete(expense);
    }


    // CATEGORY SUMMARY
    public List<Object[]> getCategorySummary(Integer tripId) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        User currentUser = getCurrentUser();

        if (!trip.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException(
                    "You are not authorized to view this summary");
        }

        return expenseRepository.getCategorySummary(tripId);
    }


    // REMAINING BUDGET
    public BigDecimal getRemainingBudget(Integer tripId) {

        Budget budget = budgetRepository.findByTripId(tripId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Budget not found for this trip"));

        BigDecimal totalExpenses =
                expenseRepository.getTotalExpensesByTripId(tripId);

        return budget.getAmount().subtract(totalExpenses);
    }


    // CURRENT LOGGED-IN USER
    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}