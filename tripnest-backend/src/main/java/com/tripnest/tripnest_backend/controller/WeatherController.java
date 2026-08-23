package com.tripnest.tripnest_backend.controller;

import com.tripnest.tripnest_backend.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public String getWeather(
            @RequestParam double latitude,
            @RequestParam double longitude) {

        return weatherService.getWeather(latitude, longitude);
    }
}