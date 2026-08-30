package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.entity.Destination;
import com.tripnest.tripnest_backend.entity.User;
import com.tripnest.tripnest_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public User getProfile() { return userService.getCurrentUserProfile(); }

    @PutMapping
    public User updateProfile(@RequestBody User request) { return userService.updateCurrentUserProfile(request); }

    @GetMapping("/preferences")
    public Map<String, Object> getPreferences() { return userService.getPreferences(); }

    @PutMapping("/preferences")
    public Map<String, Object> updatePreferences(@RequestBody Map<String, String> preferences) {
        return userService.updatePreferences(preferences);
    }

    @GetMapping("/favorites")
    public List<Destination> getFavorites() { return userService.getFavoriteDestinations(); }

    @DeleteMapping("/favorites/{destinationId}")
    public void removeFavorite(@PathVariable Integer destinationId) { userService.removeFavoriteDestination(destinationId); }
}
