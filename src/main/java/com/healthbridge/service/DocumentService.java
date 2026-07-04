// service/DocumentService.java
package com.healthbridge.service;
import com.healthbridge.common.enums.DocumentType;
import com.healthbridge.common.enums.TimelineEventType;
import com.healthbridge.common.exception.ResourceNotFoundException;
import com.healthbridge.dto.ai.AiExtractionResult;
import com.healthbridge.dto.document.DocumentResponse;
import com.healthbridge.entity.*;
import com.healthbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class DocumentService {
    private final MedicalDocumentRepository documentRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final AiService aiService;

    public DocumentResponse upload(Long patientId, MultipartFile file, DocumentType type) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        String path = fileStorageService.store(file);
        String extractedText = extractText(file);

        MedicalDocument document = MedicalDocument.builder()
                .patient(patient).fileName(file.getOriginalFilename())
                .filePath(path).type(type).uploadedAt(LocalDateTime.now())
                .aiExtractedText(extractedText)
                .build();
        document = documentRepository.save(document);

        AiExtractionResult result = aiService.extractFromDocument(extractedText);
        timelineEventRepository.save(TimelineEvent.builder()
                .patient(patient).type(TimelineEventType.LAB_REPORT)
                .title(file.getOriginalFilename())
                .description(result.getSummaryText())
                .eventDate(LocalDate.now())
                .sourceDocument(document)
                .build());

        return toResponse(document);
    }

    public List<DocumentResponse> list(Long patientId) {
        return documentRepository.findByPatientIdOrderByUploadedAtDesc(patientId)
                .stream().map(this::toResponse).toList();
    }

    public void delete(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    private String extractText(MultipartFile file) {
        try {
            if (file.getContentType() != null && file.getContentType().equals("application/pdf")) {
                try (var doc = Loader.loadPDF(file.getBytes())) {
                    return new PDFTextStripper().getText(doc);
                }
            }
            return "Image document uploaded: " + file.getOriginalFilename();
        } catch (IOException e) {
            return "";
        }
    }

    private DocumentResponse toResponse(MedicalDocument d) {
        return DocumentResponse.builder()
                .id(d.getId()).fileName(d.getFileName()).type(d.getType().name())
                .uploadedAt(d.getUploadedAt()).aiExtractedText(d.getAiExtractedText())
                .build();
    }
}