package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.entity.Expense;
import com.tripnest.tripnest_backend.service.ExpenseService;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }


    // CREATE EXPENSE
    @PostMapping("/trip/{tripId}")
    public Expense createExpense(
            @PathVariable Integer tripId,
            @RequestBody Expense expense) {

        return expenseService.createExpense(tripId, expense);
    }


    // LIST EXPENSES
    @GetMapping("/trip/{tripId}")
    public List<Expense> getExpenses(
            @PathVariable Integer tripId) {

        return expenseService.getExpenses(tripId);
    }


    // UPDATE EXPENSE
    @PutMapping("/{expenseId}")
    public Expense updateExpense(
            @PathVariable Integer expenseId,
            @RequestBody Expense expense) {

        return expenseService.updateExpense(
                expenseId,
                expense);
    }


    // DELETE EXPENSE
    @DeleteMapping("/{expenseId}")
    public String deleteExpense(
            @PathVariable Integer expenseId) {

        expenseService.deleteExpense(expenseId);

        return "Expense deleted successfully";
    }


    // CATEGORY SUMMARY
    @GetMapping("/trip/{tripId}/category-summary")
    public List<Object[]> getCategorySummary(
            @PathVariable Integer tripId) {

        return expenseService.getCategorySummary(tripId);
    }


    // REMAINING BUDGET
    @GetMapping("/trip/{tripId}/remaining-budget")
    public BigDecimal getRemainingBudget(
            @PathVariable Integer tripId) {

        return expenseService.getRemainingBudget(tripId);
    }
}