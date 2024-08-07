package com.lec.spring.config.oauth2.provider;

import java.time.LocalDate;

public interface OAuth2UserInfo {

    String getProvider();

    String getProviderId();

    String getEmail();

    String getName();

    LocalDate getBirthDay();

    LocalDate getbirthDay();

    String getGender();
}
