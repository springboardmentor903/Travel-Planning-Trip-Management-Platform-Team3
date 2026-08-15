package com.tripnest.tripnest_backend.entity;


import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class Trip {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;
	
	@ManyToOne
	@JoinColumn(name = "destination_id", nullable = false)
	private Destination destination;
	
	private String title;

	private LocalDate startDate;

	private LocalDate endDate;

	private String status;
	
}
