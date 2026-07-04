// service/DoctorService.java
package com.healthbridge.service;
import com.healthbridge.common.enums.Role;
import com.healthbridge.dto.doctor.PatientSearchResponse;
import com.healthbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class DoctorService {
    private final UserRepository userRepository;

    public List<PatientSearchResponse> searchPatients(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
                .filter(u -> u.getRole() == Role.PATIENT)
                .map(u -> PatientSearchResponse.builder().id(u.getId()).name(u.getName()).email(u.getEmail()).build())
                .toList();
    }
}