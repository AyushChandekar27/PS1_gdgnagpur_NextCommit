// repository/MedicalDocumentRepository.java
package com.healthbridge.repository;
import com.healthbridge.entity.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {
    List<MedicalDocument> findByPatientIdOrderByUploadedAtDesc(Long patientId);
}