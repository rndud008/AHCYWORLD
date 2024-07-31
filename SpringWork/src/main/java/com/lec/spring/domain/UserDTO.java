package com.lec.spring.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class UserDTO {
    private String username;
    private String password;
    private String email;
    private String name;
    private String gender;
    private String birthDay;

}
