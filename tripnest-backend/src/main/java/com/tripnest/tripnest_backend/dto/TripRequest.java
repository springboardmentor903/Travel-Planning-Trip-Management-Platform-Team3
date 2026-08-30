package com.tripnest.tripnest_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Data
@NoArgsConstructor
@AllArgsConstructor

public class TripRequest {

	private Integer destinationId;
	private String title;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	private String status;
	
}
