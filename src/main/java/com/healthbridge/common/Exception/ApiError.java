// common/exception/ApiError.java
package com.healthbridge.common.exception;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
