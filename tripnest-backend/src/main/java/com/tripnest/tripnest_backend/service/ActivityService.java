package com.tripnest.tripnest_backend.service;

import com.tripnest.tripnest_backend.entity.Activity;
import com.tripnest.tripnest_backend.entity.Itinerary;
import com.tripnest.tripnest_backend.repository.ActivityRepository;
import com.tripnest.tripnest_backend.repository.ItineraryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ItineraryRepository itineraryRepository;

    public Activity createActivity(Integer itineraryId, Activity activity) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));
                activity.setItinerary(itinerary);

        return activityRepository.save(activity);
    }

    public List<Activity> getActivitiesByItineraryId(Integer itineraryId) {

        itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        return activityRepository.findByItineraryId(itineraryId);
    }
    public Activity updateActivity(
            Integer itineraryId,
            Integer activityId,
            Activity updatedActivity) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!activity.getItinerary().getId().equals(itinerary.getId())) {
            throw new RuntimeException(
                    "Activity does not belong to this itinerary");
        }
        activity.setName(updatedActivity.getName());
        activity.setDescription(updatedActivity.getDescription());
        activity.setLocation(updatedActivity.getLocation());
        activity.setStartTime(updatedActivity.getStartTime());
        activity.setEndTime(updatedActivity.getEndTime());

        return activityRepository.save(activity);
    }

    public void deleteActivity(
            Integer itineraryId,
            Integer activityId) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!activity.getItinerary().getId().equals(itinerary.getId())) {
            throw new RuntimeException(
                    "Activity does not belong to this itinerary");
        }
        activityRepository.delete(activity);
    }
}
