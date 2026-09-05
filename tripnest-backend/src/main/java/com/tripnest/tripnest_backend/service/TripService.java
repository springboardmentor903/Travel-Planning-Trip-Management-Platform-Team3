package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.dto.TripRequest;
import com.tripnest.tripnest_backend.entity.Destination;
import com.tripnest.tripnest_backend.repository.DestinationRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;
import com.tripnest.tripnest_backend.repository.UserRepository;
import com.tripnest.tripnest_backend.repository.TripMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor

public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    
    private final DestinationRepository destinationRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripAccessService tripAccessService;
    
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public List<Trip> getMyTrips() {
        User currentUser = getCurrentUser();

        List<Trip> trips = new java.util.ArrayList<>(tripRepository.findByOwnerId(currentUser.getId()));
        tripMemberRepository.findTripsByUserId(currentUser.getId()).forEach(trip -> {
            if (trips.stream().noneMatch(existing -> existing.getId().equals(trip.getId()))) trips.add(trip);
        });
        return trips;
    }
	
  public Trip getTripById(Integer tripId) {
    User currentUser = getCurrentUser();

    Trip trip = tripAccessService.getTrip(tripId);

    tripAccessService.checkAccess(tripId, currentUser);

    return trip;
}
    
    public Trip createTrip(TripRequest request) {

        validateRequest(request);

        User currentUser = getCurrentUser();

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        Trip trip = new Trip();

        trip.setOwner(currentUser);
        trip.setDestination(destination);
        trip.setTitle(request.getTitle());
		trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setStatus(request.getStatus());

        return tripRepository.save(trip);
    }
    
public Trip updateTrip(Integer tripId, TripRequest request) {
    validateRequest(request);

    User currentUser = getCurrentUser();

    Trip trip = tripAccessService.getTrip(tripId);

    if (!tripAccessService.isOwner(tripId, currentUser)) {
        throw new RuntimeException(
                "Only the trip owner can update this trip");
    }

    Destination destination = destinationRepository.findById(request.getDestinationId())
            .orElseThrow(() -> new RuntimeException("Destination not found"));

    trip.setDestination(destination);
    trip.setTitle(request.getTitle());
    trip.setDescription(request.getDescription());
    trip.setStartDate(request.getStartDate());
    trip.setEndDate(request.getEndDate());
    trip.setStatus(request.getStatus());

    return tripRepository.save(trip);
}

    private void validateRequest(TripRequest request) {
        if (request == null || request.getDestinationId() == null) {
            throw new IllegalArgumentException("A destination is required");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("A trip title is required");
        }
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }
    
   public void deleteTrip(Integer tripId) {
    User currentUser = getCurrentUser();

    Trip trip = tripAccessService.getTrip(tripId);

    if (!tripAccessService.isOwner(tripId, currentUser)) {
        throw new RuntimeException(
                "Only the trip owner can delete this trip");
    }

    tripRepository.delete(trip);
}
    
}
