package com.edxp.user.repository;

import com.edxp.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByNameAndPhoneAndBirth(String name, String phone, String birth);
    Optional<UserEntity> findByUsernameAndNameAndPhoneAndBirth(String username, String name, String phone, String birth);
}
