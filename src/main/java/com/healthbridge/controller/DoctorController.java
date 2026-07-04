// controller/DoctorController.java
package com.healthbridge.controller;
import com.healthbridge.dto.doctor.PatientSearchResponse;
import com.healthbridge.dto.patient.PatientProfileResponse;
import com.healthbridge.service.DoctorService;
import com.healthbridge.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/doctor") @RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final PatientService patientService;

    @GetMapping("/patients")
    public ResponseEntity<List<PatientSearchResponse>> search(@RequestParam String query) {
        return ResponseEntity.ok(doctorService.searchPatients(query));
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<PatientProfileResponse> getPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getProfile(patientId));
    }
}