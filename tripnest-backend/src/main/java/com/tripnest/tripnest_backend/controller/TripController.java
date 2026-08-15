package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.dto.TripRequest;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor

public class TripController {

	 private final TripService tripService;

	    @PostMapping
	    public Trip createTrip(@RequestBody TripRequest request) {
	        return tripService.createTrip(request);
	    }

	    @GetMapping
	    public List<Trip> getMyTrips() {
	        return tripService.getMyTrips();
	    }

	    @GetMapping("/{id}")
	    public Trip getTripById(@PathVariable Integer id) {
	        return tripService.getTripById(id);
	    }

	    @PutMapping("/{id}")
	    public Trip updateTrip(
	            @PathVariable Integer id,
	            @RequestBody TripRequest request) {
	    	
	    	 return tripService.updateTrip(id, request);
	    }
	    @DeleteMapping("/{id}")
	    public String deleteTrip(@PathVariable Integer id) {
	        tripService.deleteTrip(id);
	        return "Trip deleted successfully";
	    }
	    
	
}
