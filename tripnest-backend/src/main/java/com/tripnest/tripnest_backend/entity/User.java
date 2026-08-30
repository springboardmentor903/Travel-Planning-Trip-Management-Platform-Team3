package com.tripnest.tripnest_backend.entity;
 
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 
import java.time.LocalDateTime;
 
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    @Column(nullable = false)
    private String name;
 
    @Column(nullable = false, unique = true)
    private String email;
 
    @Column(name = "password_hash", nullable = false)
    @JsonIgnore
    private String passwordHash;
 
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
 
    @Column(name = "oauth_google")
    private Boolean oauthGoogle = false;
 
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private String location;

    @ElementCollection
    @CollectionTable(name = "user_languages", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "language")
    private java.util.Set<String> languages = new java.util.LinkedHashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "preference_key")
    @Column(name = "preference_value")
    private java.util.Map<String, String> preferences = new java.util.LinkedHashMap<>();

    @ManyToMany
    @JoinTable(name = "user_favorite_destinations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "destination_id"))
    private java.util.Set<Destination> favoriteDestinations = new java.util.LinkedHashSet<>();
 
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
