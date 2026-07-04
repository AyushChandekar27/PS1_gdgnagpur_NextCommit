// entity/Medication.java
package com.healthbridge.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name="medications") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Medication {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id", nullable=false) private User patient;
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private boolean active;
}