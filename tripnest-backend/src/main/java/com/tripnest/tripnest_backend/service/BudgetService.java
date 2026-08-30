package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.entity.Budget;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.repository.BudgetRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TripRepository tripRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         TripRepository tripRepository) {
        this.budgetRepository = budgetRepository;
        this.tripRepository = tripRepository;
    }

    public Budget createBudget(Integer tripId, Budget budget) {

        if (budget.getAmount() == null ||
                budget.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Budget amount cannot be negative");
        }

        if (budget.getCurrency() == null ||
                budget.getCurrency().isBlank()) {
            throw new RuntimeException("Currency is required");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        Optional<Budget> existingBudget =
                budgetRepository.findByTripId(tripId);

        if (existingBudget.isPresent()) {
            throw new RuntimeException(
                    "Budget already exists for this trip");
        }

        budget.setTrip(trip);

        return budgetRepository.save(budget);
    }

    public Budget getBudgetByTripId(Integer tripId) {

        return budgetRepository.findByTripId(tripId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Budget not found for this trip"));
    }

    public Budget updateBudget(Integer tripId, Budget updatedBudget) {

        if (updatedBudget.getAmount() == null ||
                updatedBudget.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Budget amount cannot be negative");
        }

        if (updatedBudget.getCurrency() == null ||
                updatedBudget.getCurrency().isBlank()) {
            throw new RuntimeException("Currency is required");
        }

        Budget existingBudget = budgetRepository.findByTripId(tripId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Budget not found for this trip"));

        existingBudget.setAmount(updatedBudget.getAmount());
        existingBudget.setCurrency(updatedBudget.getCurrency());

        return budgetRepository.save(existingBudget);
    }
}