// dto/document/DocumentResponse.java
package com.healthbridge.dto.document;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String fileName;
    private String type;
    private LocalDateTime uploadedAt;
    private String aiExtractedText;
}