package com.tripnest.tripnest_backend.dto;

public record TripSearchResponse(Integer id, String title, String destination, String ownerName, long memberCount) { }
