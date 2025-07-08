package com.example.telemetryapp.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      // Allow your Netlify site (and localhost for testing)
      .allowedOrigins(
        "https://telemetrywebsite.netlify.app"
        //"http://localhost:8888"   // adjust if you run React locally on a different port
      )
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .allowCredentials(true);
  }
}