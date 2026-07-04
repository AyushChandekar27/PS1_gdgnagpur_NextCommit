// controller/DocumentController.java
package com.healthbridge.controller;
import com.healthbridge.common.enums.DocumentType;
import com.healthbridge.dto.document.DocumentResponse;
import com.healthbridge.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController @RequestMapping("/api/documents") @RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping(value = "/{patientId}", consumes = "multipart/form-data")
    public ResponseEntity<DocumentResponse> upload(@PathVariable Long patientId,
                                                     @RequestParam MultipartFile file,
                                                     @RequestParam DocumentType type) {
        return ResponseEntity.ok(documentService.upload(patientId, file, type));
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<DocumentResponse>> list(@PathVariable Long patientId) {
        return ResponseEntity.ok(documentService.list(patientId));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(@PathVariable Long documentId) {
        documentService.delete(documentId);
        return ResponseEntity.noContent().build();
    }
}