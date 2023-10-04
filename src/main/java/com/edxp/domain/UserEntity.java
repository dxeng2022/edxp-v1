package com.edxp.domain;

import com.edxp._core.constant.RoleType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Getter
@Table(name = "\"User\"")
//@SQLDelete(sql = "UPDATE `User` SET deletedAt = NOW() where id=?")
@Where(clause = "deletedAt is NULL")
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter @Column(unique = true, nullable = false) private String username;

    @Setter @Column(nullable = false) private String password;
    @Setter @Column(nullable = false) private String name;
    @Setter @Column(nullable = false) private String phone;
    @Setter @Column(nullable = false) private String gender;
    @Setter @Column(nullable = false) private String birth;
    @Setter @Column private String organization;
    @Setter @Column private String job;

    @Column(nullable = false) private String role;

    private Timestamp registeredAt;
    private Timestamp updatedAt;
    @Setter private Timestamp deletedAt;

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
        this.role = RoleType.USER.getDescription();
    }

    @PrePersist
    void registeredAt() {
        this.registeredAt = Timestamp.from(Instant.now());
    }

    @PreUpdate
    void updatedAt() {
        this.updatedAt = Timestamp.from(Instant.now());
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
