package com.tripnest.tripnest_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trip_members", uniqueConstraints = @UniqueConstraint(columnNames = {"trip_id", "user_id"}))
@Data
@NoArgsConstructor
public class TripMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false) @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(optional = false) @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String role = "MEMBER";
}
