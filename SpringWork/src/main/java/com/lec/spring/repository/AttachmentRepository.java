package com.lec.spring.repository;

import com.lec.spring.domain.Attachment;
import com.lec.spring.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment,Long> {
}
