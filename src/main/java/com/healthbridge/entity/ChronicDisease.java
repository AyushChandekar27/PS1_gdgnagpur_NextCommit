// entity/ChronicDisease.java
package com.healthbridge.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name="chronic_diseases") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChronicDisease {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id", nullable=false) private User patient;
    private String name;
    private LocalDate diagnosedDate;
}