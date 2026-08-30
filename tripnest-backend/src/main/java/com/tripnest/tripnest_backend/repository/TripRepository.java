package com.tripnest.tripnest_backend.repository;

import com.tripnest.tripnest_backend.entity.Trip;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Integer> {

	List<Trip> findByOwnerId(Integer ownerId);

    List<Trip> findTop20ByTitleContainingIgnoreCaseOrderByTitleAsc(String title);
	
}
