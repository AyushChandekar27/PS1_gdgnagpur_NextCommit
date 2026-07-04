// dto/patient/ChronicDiseaseDto.java
package com.healthbridge.dto.patient;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ChronicDiseaseDto {
    private Long id;
    @NotBlank private String name;
    private LocalDate diagnosedDate;
}