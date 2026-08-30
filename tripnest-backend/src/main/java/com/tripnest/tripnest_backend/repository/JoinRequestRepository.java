package com.tripnest.tripnest_backend.repository;

import com.tripnest.tripnest_backend.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Integer> {
    boolean existsByTripIdAndRequesterId(Integer tripId, Integer requesterId);
}
