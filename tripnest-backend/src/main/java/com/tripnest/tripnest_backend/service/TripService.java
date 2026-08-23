package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.dto.TripRequest;
import com.tripnest.tripnest_backend.entity.Destination;
import com.tripnest.tripnest_backend.repository.DestinationRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;
import com.tripnest.tripnest_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor

public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    
    private final DestinationRepository destinationRepository;
    
    
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public List<Trip> getMyTrips() {
        User currentUser = getCurrentUser();

        return tripRepository.findByOwnerId(currentUser.getId());
    }
	
    public Trip getTripById(Integer tripId) {
        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to access this trip");
        }

        return trip;
    }
    
    public Trip createTrip(TripRequest request) {

        User currentUser = getCurrentUser();

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        Trip trip = new Trip();

        trip.setOwner(currentUser);
        trip.setDestination(destination);
        trip.setTitle(request.getTitle());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setStatus(request.getStatus());

        return tripRepository.save(trip);
    }
    
    public Trip updateTrip(Integer tripId, TripRequest request) {

        Trip trip = getTripById(tripId);

        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        trip.setDestination(destination);
        trip.setTitle(request.getTitle());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setStatus(request.getStatus());

        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Integer tripId) {

        Trip trip = getTripById(tripId);

        tripRepository.delete(trip);
    }
    
}
