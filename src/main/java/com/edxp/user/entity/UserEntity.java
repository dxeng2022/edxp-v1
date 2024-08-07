package com.edxp.user.entity;

import com.edxp._core.constant.RoleType;
import com.edxp.user.converter.RoleTypeListConverter;
import lombok.Getter;
import lombok.ToString;
import org.apache.commons.lang3.ObjectUtils;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@ToString
@Getter
@Table(name = "\"User\"")
//@SQLDelete(sql = "UPDATE `User` SET deletedAt = NOW() where id=?")
@Where(clause = "deletedAt is NULL")
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) private String username;

    @Column(nullable = false) private String password;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String phone;
    @Column(nullable = false) private String gender;
    @Column(nullable = false) private String birth;
    @Column private String organization;
    @Column private String job;

    @Convert(converter = RoleTypeListConverter.class)
    @Column(nullable = false)
    private List<RoleType> roles  = new ArrayList<>();

    private Timestamp registeredAt;
    private Timestamp updatedAt;
    private Timestamp deletedAt;

    protected UserEntity() {
    }

    private UserEntity(
            String username,
            String password,
            String name,
            String phone,
            String gender,
            String birth,
            String organization,
            String job
    ) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.gender = gender;
        this.birth = birth;
        this.organization = organization;
        this.job = job;
    }

    public void setRoleUser() {
        this.roles.add(RoleType.USER);
    }

    public void updateUsername(String username) {
        this.username = username;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    private void updatePhone(String phone) {
        this.phone = phone;
    }

    public void updateUserInfo(String encPassword, String phone) {
        if (!ObjectUtils.isEmpty(encPassword)) {
            updatePassword(encPassword);
        }

        if (!ObjectUtils.isEmpty(phone)) {
            updatePhone(phone);
        }
    }

    public void updateRoles(List<RoleType> roles) {
        this.roles = roles;
    }

    @PrePersist
    void registeredAt() {
        this.registeredAt = Timestamp.from(Instant.now());
    }

    @PreUpdate
    void updatedAt() {
        this.updatedAt = Timestamp.from(Instant.now());
    }

    public void updateDeletedAt() {
        this.deletedAt = Timestamp.from(Instant.now());
    }

    public static UserEntity of(
            String username,
            String password,
            String name,
            String phone,
            String gender,
            String birth,
            String organization,
            String job
    ) {
        UserEntity userEntity = new UserEntity(username, password, name, phone, gender, birth, organization, job);
        userEntity.setRoleUser();

        return userEntity;
    }
}
