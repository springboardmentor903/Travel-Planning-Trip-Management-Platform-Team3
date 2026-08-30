package com.tripnest.tripnest_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "join_requests", uniqueConstraints = @UniqueConstraint(columnNames = {"trip_id", "requester_id"}))
@Data
@NoArgsConstructor
public class JoinRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false) @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(optional = false) @JoinColumn(name = "requester_id")
    private User requester;

    @Column(nullable = false)
    private String status = "PENDING";
}
