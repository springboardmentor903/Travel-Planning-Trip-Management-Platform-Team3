package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.dto.TripMemberResponse;
import com.tripnest.tripnest_backend.dto.TripSearchResponse;
import com.tripnest.tripnest_backend.entity.JoinRequest;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.entity.TripMember;
import com.tripnest.tripnest_backend.entity.User;
import com.tripnest.tripnest_backend.repository.JoinRequestRepository;
import com.tripnest.tripnest_backend.repository.TripMemberRepository;
import com.tripnest.tripnest_backend.repository.TripRepository;
import com.tripnest.tripnest_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripCollaborationService {
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository tripMemberRepository;
    private final JoinRequestRepository joinRequestRepository;

    public List<TripMemberResponse> getMembers(Integer tripId) {
        Trip trip = findOwnedTrip(tripId);
        List<TripMemberResponse> members = new java.util.ArrayList<>();
        members.add(toResponse(trip.getOwner(), "OWNER"));
        tripMemberRepository.findByTripId(tripId).forEach(member -> members.add(toResponse(member.getUser(), member.getRole())));
        return members;
    }

    public TripMemberResponse inviteMember(Integer tripId, String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email is required");
        Trip trip = findOwnedTrip(tripId);
        User user = userRepository.findByEmail(email.trim()).orElseThrow(() -> new IllegalArgumentException("No user exists with that email"));
        if (trip.getOwner().getId().equals(user.getId())) throw new IllegalArgumentException("The trip owner is already a member");
        if (tripMemberRepository.findByTripIdAndUserId(tripId, user.getId()).isPresent()) throw new IllegalArgumentException("User is already a trip member");
        TripMember member = new TripMember(); member.setTrip(trip); member.setUser(user); member.setRole("MEMBER");
        tripMemberRepository.save(member);
        return toResponse(user, member.getRole());
    }

    public TripMemberResponse updateMemberRole(Integer tripId, Integer userId, String role) {
        findOwnedTrip(tripId);
        if (!"MEMBER".equals(role) && !"GROUP_ADMIN".equals(role)) throw new IllegalArgumentException("Role must be MEMBER or GROUP_ADMIN");
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId).orElseThrow(() -> new IllegalArgumentException("Trip member not found"));
        member.setRole(role); tripMemberRepository.save(member);
        return toResponse(member.getUser(), role);
    }

    public void removeMember(Integer tripId, Integer userId) {
        findOwnedTrip(tripId);
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId).orElseThrow(() -> new IllegalArgumentException("Trip member not found"));
        tripMemberRepository.delete(member);
    }

    public List<TripSearchResponse> searchTrips(String name) {
        if (name == null || name.isBlank()) return List.of();
        return tripRepository.findTop20ByTitleContainingIgnoreCaseOrderByTitleAsc(name.trim()).stream()
                .map(trip -> new TripSearchResponse(trip.getId(), trip.getTitle(), trip.getDestination().getName(), trip.getOwner().getName(), tripMemberRepository.findByTripId(trip.getId()).size() + 1L)).toList();
    }

    public void requestToJoin(Integer tripId) {
        User user = currentUser();
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        if (trip.getOwner().getId().equals(user.getId()) || tripMemberRepository.findByTripIdAndUserId(tripId, user.getId()).isPresent()) throw new IllegalArgumentException("You are already a trip member");
        if (joinRequestRepository.existsByTripIdAndRequesterId(tripId, user.getId())) throw new IllegalArgumentException("A join request is already pending");
        JoinRequest request = new JoinRequest(); request.setTrip(trip); request.setRequester(user); joinRequestRepository.save(request);
    }

    private Trip findOwnedTrip(Integer tripId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        if (!trip.getOwner().getId().equals(currentUser().getId())) throw new SecurityException("Only the trip owner can manage members");
        return trip;
    }
    private User currentUser() { return userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists")); }
    private TripMemberResponse toResponse(User user, String role) { return new TripMemberResponse(user.getId(), user.getName(), user.getEmail(), role); }
}
