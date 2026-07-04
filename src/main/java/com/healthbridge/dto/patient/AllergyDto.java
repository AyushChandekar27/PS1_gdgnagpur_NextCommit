// dto/patient/AllergyDto.java
package com.healthbridge.dto.patient;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AllergyDto {
    private Long id;
    @NotBlank private String name;
    private String severity;
}