// dto/patient/TimelineEventDto.java
package com.healthbridge.dto.patient;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TimelineEventDto {
    private Long id;
    private String type;
    private String title;
    private String description;
    private LocalDate eventDate;
}