package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.entity.Itinerary;
import com.tripnest.tripnest_backend.service.ItineraryService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor

public class ItineraryController {
 private final ItineraryService itineraryService;

    @PostMapping("/{tripId}/itineraries")
    public Itinerary createItinerary(
            @PathVariable Integer tripId,
            @RequestBody Itinerary itinerary) {

        return itineraryService.createItinerary(tripId, itinerary);
    }

    @GetMapping("/{tripId}/itineraries")
    public List<Itinerary> getItineraries(
            @PathVariable Integer tripId) {

        return itineraryService.getItinerariesByTripId(tripId);
    }
}
