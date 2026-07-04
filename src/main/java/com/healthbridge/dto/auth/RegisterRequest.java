// dto/auth/RegisterRequest.java
package com.healthbridge.dto.auth;
import com.healthbridge.common.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
public class RegisterRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=6) private String password;
    @NotNull private Role role;
    private LocalDate dob;
    private String gender;
}