package com.tripnest.tripnest_backend.repository;

import com.tripnest.tripnest_backend.entity.TripMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.tripnest.tripnest_backend.entity.Trip;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TripMemberRepository extends JpaRepository<TripMember, Integer> {
    List<TripMember> findByTripId(Integer tripId);
    Optional<TripMember> findByTripIdAndUserId(Integer tripId, Integer userId);

    @Query("select member.trip from TripMember member where member.user.id = :userId")
    List<Trip> findTripsByUserId(@Param("userId") Integer userId);
}
