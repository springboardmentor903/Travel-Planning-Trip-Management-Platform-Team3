package com.tripnest.tripnest_backend.service;
 
import com.tripnest.tripnest_backend.dto.AuthResponse;
import com.tripnest.tripnest_backend.dto.LoginRequest;
import com.tripnest.tripnest_backend.dto.RegisterRequest;
import com.tripnest.tripnest_backend.entity.Role;
import com.tripnest.tripnest_backend.entity.User;
import com.tripnest.tripnest_backend.repository.RoleRepository;
import com.tripnest.tripnest_backend.repository.UserRepository;
import com.tripnest.tripnest_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tripnest.tripnest_backend.entity.Destination;
import com.tripnest.tripnest_backend.repository.DestinationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
 
@Service
@RequiredArgsConstructor
public class UserService {
 
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final DestinationRepository destinationRepository;
 
    private static final String DEFAULT_ROLE = "TRAVELER";
 
    public AuthResponse registerUser(RegisterRequest request) {
 
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }
 
        Role defaultRole = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new RuntimeException(
                        "Default role not found. Make sure roles are seeded."));
 
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(defaultRole);
        user.setOauthGoogle(false);
 
        User savedUser = userRepository.save(user);
 
        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                "User registered successfully",
                null
        );
    }
 
    public AuthResponse loginUser(LoginRequest request) {
 
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
 
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
 
        String token = jwtUtil.generateToken(user.getEmail());
 
        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                "Login successful",
                token
        );
    }

    public User getCurrentUserProfile() {
        return getCurrentUser();
    }

    public User updateCurrentUserProfile(User request) {
        User user = getCurrentUser();
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        user.setName(request.getName().trim());
        user.setLocation(request.getLocation());
        user.setLanguages(request.getLanguages() == null ? new LinkedHashSet<>() : new LinkedHashSet<>(request.getLanguages()));
        return userRepository.save(user);
    }

    public Map<String, Object> getPreferences() {
        User user = getCurrentUser();
        return Map.of("preferences", new LinkedHashMap<>(user.getPreferences()));
    }

    public Map<String, Object> updatePreferences(Map<String, String> preferences) {
        User user = getCurrentUser();
        user.setPreferences(preferences == null ? new LinkedHashMap<>() : new LinkedHashMap<>(preferences));
        userRepository.save(user);
        return getPreferences();
    }

    public List<Destination> getFavoriteDestinations() {
        return List.copyOf(getCurrentUser().getFavoriteDestinations());
    }

    public void removeFavoriteDestination(Integer destinationId) {
        User user = getCurrentUser();
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
        user.getFavoriteDestinations().remove(destination);
        userRepository.save(user);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));
    }
}
