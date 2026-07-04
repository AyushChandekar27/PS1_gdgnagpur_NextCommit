// entity/TimelineEvent.java
package com.healthbridge.entity;
import com.healthbridge.common.enums.TimelineEventType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name="timeline_events") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimelineEvent {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id", nullable=false) private User patient;
    @Enumerated(EnumType.STRING) private TimelineEventType type;
    private String title;
    @Column(columnDefinition="TEXT") private String description;
    private LocalDate eventDate;
    @ManyToOne @JoinColumn(name="source_document_id") private MedicalDocument sourceDocument;
}