// entity/MedicalDocument.java
package com.healthbridge.entity;
import com.healthbridge.common.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="medical_documents") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalDocument {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id", nullable=false) private User patient;
    private String fileName;
    private String filePath;
    @Enumerated(EnumType.STRING) private DocumentType type;
    private LocalDateTime uploadedAt;
    @Column(columnDefinition="TEXT") private String aiExtractedText;
}