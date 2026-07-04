// service/AiService.java
package com.healthbridge.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthbridge.dto.ai.AiExtractionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

@Service @RequiredArgsConstructor
public class AiService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${claude.api.key}") private String apiKey;
    @Value("${claude.api.url}") private String apiUrl;
    @Value("${claude.api.model}") private String model;

    public AiExtractionResult extractFromDocument(String documentText) {
        String prompt = """
            Extract structured medical info from this report as JSON only, no markdown, no preamble.
            Schema: {"summaryText": string, "diagnoses": [string], "medications": [string], "allergies": [string], "labFindings": [string]}
            Report:
            """ + documentText;
        String json = callClaude(prompt);
        return parseExtraction(json);
    }

    public String generateSummary(String aggregatedHistory) {
        String prompt = "Generate a concise 5-6 sentence patient health summary for a doctor from this history:\n" + aggregatedHistory;
        return callClaude(prompt);
    }

    private String callClaude(String prompt) {
        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", 1024,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );
        JsonNode response = webClient.post()
                .uri(apiUrl)
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        return response.path("content").get(0).path("text").asText();
    }

    private AiExtractionResult parseExtraction(String json) {
        try {
            String clean = json.replaceAll("```json|```", "").trim();
            JsonNode node = objectMapper.readTree(clean);
            return AiExtractionResult.builder()
                    .summaryText(node.path("summaryText").asText(""))
                    .diagnoses(toList(node.path("diagnoses")))
                    .medications(toList(node.path("medications")))
                    .allergies(toList(node.path("allergies")))
                    .labFindings(toList(node.path("labFindings")))
                    .build();
        } catch (Exception e) {
            return AiExtractionResult.builder().summaryText(json)
                    .diagnoses(List.of()).medications(List.of()).allergies(List.of()).labFindings(List.of()).build();
        }
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node.isArray()) node.forEach(n -> list.add(n.asText()));
        return list;
    }
}