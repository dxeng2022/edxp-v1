package com.edxp.domain;

import com.edxp.constant.GenderType;
import com.edxp.constant.RoleType;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Getter
@Table(name = "\"User\"")
@SQLDelete(sql = "UPDATE \"User\" SET deletedAt = NOW() where id=?")
@Where(clause = "deletedAt is NULL")
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) private String username;

    @Setter @Column(nullable = false) private String password;
    @Setter @Column(nullable = false) private String phone;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String gender;
    @Column(nullable = false) private String birth;
    @Column private String organization;
    @Column private String job;

    @Column(nullable = false) private String role;

    private Timestamp registeredAt;
    private Timestamp updatedAt;
    private Timestamp deletedAt;

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
}
