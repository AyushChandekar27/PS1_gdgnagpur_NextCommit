// entity/Allergy.java
package com.healthbridge.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="allergies") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Allergy {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id", nullable=false) private User patient;
    private String name;
    private String severity;
}