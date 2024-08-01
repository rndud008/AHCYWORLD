package com.lec.spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfiguration {

    @Configuration
    public static class LocalMvcConfiguration implements WebMvcConfigurer{
        @Value("${app.upload.path}")
        private String uploadDir;

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry
                    .addResourceHandler("*/upload/**")
                    .addResourceLocations("file:"+uploadDir+"/");
        }
    }
}
