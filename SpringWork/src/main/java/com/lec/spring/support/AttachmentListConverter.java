package com.lec.spring.support;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Attachment;
import jakarta.persistence.AttributeConverter;

import java.util.List;

public class AttachmentListConverter implements AttributeConverter<List<Attachment>,String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Attachment> attachmentList) {


        try {
            return mapper.writeValueAsString(attachmentList);
        } catch (JsonProcessingException e) {
            System.out.println("convertToDatabaseCoumn : error");
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Attachment> convertToEntityAttribute(String s) {
        try {
            return mapper.readValue(s,mapper.getTypeFactory().constructCollectionType(List.class,Attachment.class));
        } catch (JsonProcessingException e) {
            System.out.println("convertToDatabaseCoumn : error");
            throw new RuntimeException(e);
        }
    }

}
