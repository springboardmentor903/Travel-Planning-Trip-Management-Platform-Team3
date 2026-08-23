package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.entity.Activity;
import com.tripnest.tripnest_backend.service.ActivityService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/itineraries")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/{itineraryId}/activities")
    public Activity createActivity(
            @PathVariable Integer itineraryId,
            @RequestBody Activity activity) {

        return activityService.createActivity(itineraryId, activity);
    }

    @GetMapping("/{itineraryId}/activities")
    public List<Activity> getActivities(
            @PathVariable Integer itineraryId) {

        return activityService.getActivitiesByItineraryId(itineraryId);
    }

    @PutMapping("/{itineraryId}/activities/{activityId}")
    public Activity updateActivity(
            @PathVariable Integer itineraryId,
            @PathVariable Integer activityId,
            @RequestBody Activity activity) {

        return activityService.updateActivity(
                itineraryId,
                activityId,
                activity);
    }

    @DeleteMapping("/{itineraryId}/activities/{activityId}")
    public String deleteActivity(
            @PathVariable Integer itineraryId,
            @PathVariable Integer activityId) {

        activityService.deleteActivity(itineraryId, activityId);

        return "Activity deleted successfully";
    }
}