// repository/TimelineEventRepository.java
package com.healthbridge.repository;
import com.healthbridge.entity.TimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimelineEventRepository extends JpaRepository<TimelineEvent, Long> {
    List<TimelineEvent> findByPatientIdOrderByEventDateDesc(Long patientId);
}