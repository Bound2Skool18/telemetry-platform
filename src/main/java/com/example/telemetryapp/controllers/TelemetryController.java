
package com.example.telemetryapp.controllers;

import com.example.telemetryapp.models.Telemetry;
import com.example.telemetryapp.repositories.TelemetryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/telemetry")
@CrossOrigin(origins = "http://localhost:3000") // Fixed typo in localhost
public class TelemetryController {

  private static final Logger logger = LoggerFactory.getLogger(TelemetryController.class);

  @Autowired
  private TelemetryRepository repository;

  @GetMapping
  public List<Telemetry> getAllTelemetry() {
    logger.info("Fetching all telemetry data");
    List<Telemetry> data = repository.findAll();
    logger.info("Found {} records", data.size());
    return data;
  }

  @PostMapping
  public ResponseEntity<Telemetry> createTelemetry(@RequestBody Telemetry telemetry) {
    logger.info("Creating new telemetry entry: {}", telemetry);
    Telemetry saved = repository.save(telemetry);
    logger.info("Created telemetry entry with id: {}", saved.getId());
    return new ResponseEntity<>(saved, HttpStatus.CREATED);
  }
}