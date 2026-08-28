package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.entity.Budget;
import com.tripnest.tripnest_backend.service.BudgetService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // Create Budget
    @PostMapping("/{tripId}")
    public Budget createBudget(
            @PathVariable Integer tripId,
            @RequestBody Budget budget) {

        return budgetService.createBudget(tripId, budget);
    }

    // Get Budget
    @GetMapping("/{tripId}")
    public Budget getBudget(
            @PathVariable Integer tripId) {

        return budgetService.getBudgetByTripId(tripId);
    }

    // Update Budget
    @PutMapping("/{tripId}")
    public Budget updateBudget(
            @PathVariable Integer tripId,
            @RequestBody Budget budget) {

        return budgetService.updateBudget(tripId, budget);
    }
}