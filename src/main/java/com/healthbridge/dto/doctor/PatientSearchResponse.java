// dto/doctor/PatientSearchResponse.java
package com.healthbridge.dto.doctor;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientSearchResponse {
    private Long id;
    private String name;
    private String email;
}