// dto/patient/MedicationDto.java
package com.healthbridge.dto.patient;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class MedicationDto {
    private Long id;
    @NotBlank private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private boolean active;
}