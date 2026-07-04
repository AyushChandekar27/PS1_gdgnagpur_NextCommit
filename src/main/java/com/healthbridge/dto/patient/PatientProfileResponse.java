// dto/patient/PatientProfileResponse.java
package com.healthbridge.dto.patient;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientProfileResponse {
    private Long id;
    private String name;
    private String email;
    private LocalDate dob;
    private String gender;
    private String aiSummary;
    private List<MedicationDto> medications;
    private List<AllergyDto> allergies;
    private List<ChronicDiseaseDto> chronicDiseases;
    private List<TimelineEventDto> timeline;
}