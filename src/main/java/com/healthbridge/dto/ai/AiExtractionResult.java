// dto/ai/AiExtractionResult.java
package com.healthbridge.dto.ai;
import lombok.*;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AiExtractionResult {
    private String summaryText;
    private List<String> diagnoses;
    private List<String> medications;
    private List<String> allergies;
    private List<String> labFindings;
}