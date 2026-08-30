package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.dto.TripRequest;
import com.tripnest.tripnest_backend.entity.Trip;
import com.tripnest.tripnest_backend.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.tripnest.tripnest_backend.dto.TripMemberResponse;
import com.tripnest.tripnest_backend.dto.TripSearchResponse;
import com.tripnest.tripnest_backend.service.TripCollaborationService;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor

public class TripController {

	 private final TripService tripService;
     private final TripCollaborationService tripCollaborationService;

	    @PostMapping
	    public Trip createTrip(@RequestBody TripRequest request) {
	        return tripService.createTrip(request);
	    }

	    @GetMapping("/my")
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

        @GetMapping("/search")
        public List<TripSearchResponse> searchTrips(@RequestParam String name) { return tripCollaborationService.searchTrips(name); }

        @GetMapping("/{id}/members")
        public List<TripMemberResponse> getMembers(@PathVariable Integer id) { return tripCollaborationService.getMembers(id); }

        @PostMapping("/{id}/members")
        public TripMemberResponse inviteMember(@PathVariable Integer id, @RequestBody Map<String, String> payload) { return tripCollaborationService.inviteMember(id, payload.get("email")); }

        @PatchMapping("/{id}/members/{memberId}/role")
        public TripMemberResponse updateMemberRole(@PathVariable Integer id, @PathVariable Integer memberId, @RequestBody Map<String, String> payload) { return tripCollaborationService.updateMemberRole(id, memberId, payload.get("role")); }

        @DeleteMapping("/{id}/members/{memberId}")
        public void removeMember(@PathVariable Integer id, @PathVariable Integer memberId) { tripCollaborationService.removeMember(id, memberId); }

        @PostMapping("/{id}/join-requests")
        public void requestToJoin(@PathVariable Integer id) { tripCollaborationService.requestToJoin(id); }
	    
	
}
