package com.example.telemetryapp.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Telemetry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String equipmentId; // <-- fix name

    private Instant timestamp; // <-- fix spelling

    private Double latitude;
    private Double longitude; // <-- fix spelling

    private Integer engineRpm;
    private Double fuelLevel;
    private Double soilMoisture;

    // Getters and setters (use standard names)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getEngineRpm() { return engineRpm; }
    public void setEngineRpm(Integer engineRpm) { this.engineRpm = engineRpm; }

    public Double getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Double fuelLevel) { this.fuelLevel = fuelLevel; }

    public Double getSoilMoisture() { return soilMoisture; }
    public void setSoilMoisture(Double soilMoisture) { this.soilMoisture = soilMoisture; }
}

