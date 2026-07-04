// service/PatientService.java
package com.healthbridge.service;
import com.healthbridge.common.exception.ResourceNotFoundException;
import com.healthbridge.dto.patient.*;
import com.healthbridge.entity.*;
import com.healthbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class PatientService {
    private final UserRepository userRepository;
    private final MedicationRepository medicationRepository;
    private final AllergyRepository allergyRepository;
    private final ChronicDiseaseRepository chronicDiseaseRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final AiService aiService;

    public PatientProfileResponse getProfile(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        List<MedicationDto> meds = medicationRepository.findByPatientId(patientId).stream()
                .map(m -> MedicationDto.builder().id(m.getId()).name(m.getName()).dosage(m.getDosage())
                        .frequency(m.getFrequency()).startDate(m.getStartDate()).active(m.isActive()).build())
                .collect(Collectors.toList());

        List<AllergyDto> allergies = allergyRepository.findByPatientId(patientId).stream()
                .map(a -> AllergyDto.builder().id(a.getId()).name(a.getName()).severity(a.getSeverity()).build())
                .collect(Collectors.toList());

        List<ChronicDiseaseDto> diseases = chronicDiseaseRepository.findByPatientId(patientId).stream()
                .map(c -> ChronicDiseaseDto.builder().id(c.getId()).name(c.getName()).diagnosedDate(c.getDiagnosedDate()).build())
                .collect(Collectors.toList());

        List<TimelineEventDto> timeline = timelineEventRepository.findByPatientIdOrderByEventDateDesc(patientId).stream()
                .map(t -> TimelineEventDto.builder().id(t.getId()).type(t.getType().name())
                        .title(t.getTitle()).description(t.getDescription()).eventDate(t.getEventDate()).build())
                .collect(Collectors.toList());

        String aggregated = buildAggregatedHistory(meds, allergies, diseases, timeline);
        String summary = aiService.generateSummary(aggregated);

        return PatientProfileResponse.builder()
                .id(patient.getId()).name(patient.getName()).email(patient.getEmail())
                .dob(patient.getDob()).gender(patient.getGender())
                .aiSummary(summary).medications(meds).allergies(allergies)
                .chronicDiseases(diseases).timeline(timeline)
                .build();
    }

    public MedicationDto addMedication(Long patientId, MedicationDto dto) {
        User patient = getPatient(patientId);
        Medication saved = medicationRepository.save(Medication.builder()
                .patient(patient).name(dto.getName()).dosage(dto.getDosage())
                .frequency(dto.getFrequency()).startDate(dto.getStartDate()).active(true).build());
        dto.setId(saved.getId());
        return dto;
    }

    public AllergyDto addAllergy(Long patientId, AllergyDto dto) {
        User patient = getPatient(patientId);
        Allergy saved = allergyRepository.save(Allergy.builder()
                .patient(patient).name(dto.getName()).severity(dto.getSeverity()).build());
        dto.setId(saved.getId());
        return dto;
    }

    public ChronicDiseaseDto addChronicDisease(Long patientId, ChronicDiseaseDto dto) {
        User patient = getPatient(patientId);
        ChronicDisease saved = chronicDiseaseRepository.save(ChronicDisease.builder()
                .patient(patient).name(dto.getName()).diagnosedDate(dto.getDiagnosedDate()).build());
        dto.setId(saved.getId());
        return dto;
    }

    private User getPatient(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    }

    private String buildAggregatedHistory(List<MedicationDto> meds, List<AllergyDto> allergies,
                                           List<ChronicDiseaseDto> diseases, List<TimelineEventDto> timeline) {
        StringBuilder sb = new StringBuilder();
        sb.append("Medications: ").append(meds.stream().map(MedicationDto::getName).collect(Collectors.joining(", "))).append("\n");
        sb.append("Allergies: ").append(allergies.stream().map(AllergyDto::getName).collect(Collectors.joining(", "))).append("\n");
        sb.append("Chronic Diseases: ").append(diseases.stream().map(ChronicDiseaseDto::getName).collect(Collectors.joining(", "))).append("\n");
        sb.append("Timeline: ").append(timeline.stream().map(TimelineEventDto::getTitle).collect(Collectors.joining(", ")));
        return sb.toString();
    }
}