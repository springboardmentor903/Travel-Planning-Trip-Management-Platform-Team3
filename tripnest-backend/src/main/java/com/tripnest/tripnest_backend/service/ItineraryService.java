package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.entity.Itinerary;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.repository.ItineraryRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class ItineraryService {
 private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;

    public Itinerary createItinerary(Integer tripId, Itinerary itinerary) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        itinerary.setTrip(trip);

        return itineraryRepository.save(itinerary);
    }

    public List<Itinerary> getItinerariesByTripId(Integer tripId) {

        tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return itineraryRepository.findByTripId(tripId);
    }
}

