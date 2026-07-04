// dto/auth/LoginRequest.java
package com.healthbridge.dto.auth;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class LoginRequest {
    @NotBlank @Email private String email;
    @NotBlank private String password;
}