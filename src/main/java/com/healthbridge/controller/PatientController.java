// controller/PatientController.java
package com.healthbridge.controller;
import com.healthbridge.dto.patient.*;
import com.healthbridge.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/patient") @RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/{patientId}/profile")
    public ResponseEntity<PatientProfileResponse> getProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getProfile(patientId));
    }

    @PostMapping("/{patientId}/medications")
    public ResponseEntity<MedicationDto> addMedication(@PathVariable Long patientId, @Valid @RequestBody MedicationDto dto) {
        return ResponseEntity.ok(patientService.addMedication(patientId, dto));
    }

    @PostMapping("/{patientId}/allergies")
    public ResponseEntity<AllergyDto> addAllergy(@PathVariable Long patientId, @Valid @RequestBody AllergyDto dto) {
        return ResponseEntity.ok(patientService.addAllergy(patientId, dto));
    }

    @PostMapping("/{patientId}/chronic-diseases")
    public ResponseEntity<ChronicDiseaseDto> addChronicDisease(@PathVariable Long patientId, @Valid @RequestBody ChronicDiseaseDto dto) {
        return ResponseEntity.ok(patientService.addChronicDisease(patientId, dto));
    }
}