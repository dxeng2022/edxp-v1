package com.edxp._core.config.auth;

import com.edxp.user.dto.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
public class PrincipalDetails implements UserDetails {
    private User user;

    public PrincipalDetails(User user) { this.user = user; }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public boolean isAccountNonExpired() { return this.user.getDeletedAt() == null; }

    @Override
    public boolean isAccountNonLocked() { return this.user.getDeletedAt() == null; }

    @Override
    public boolean isCredentialsNonExpired() { return this.user.getDeletedAt() == null; }

    @Override
    public boolean isEnabled() { return this.user.getDeletedAt() == null; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collectors = new ArrayList<>();
        collectors.add(user::getRole);
        return collectors;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof PrincipalDetails) {
            return this.user.getUsername().equals(((PrincipalDetails) o).getUsername());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return this.user.getUsername().hashCode();
    }
}
