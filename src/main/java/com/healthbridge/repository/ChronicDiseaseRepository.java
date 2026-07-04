// repository/ChronicDiseaseRepository.java
package com.healthbridge.repository;
import com.healthbridge.entity.ChronicDisease;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChronicDiseaseRepository extends JpaRepository<ChronicDisease, Long> {
    List<ChronicDisease> findByPatientId(Long patientId);
}