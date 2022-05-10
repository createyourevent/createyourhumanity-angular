package org.createyourhumanity.angular.web.rest;

import java.util.*;

import org.createyourhumanity.angular.domain.User;
import org.createyourhumanity.angular.service.UserService;
import org.createyourhumanity.angular.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/authenticatedUser")
    public User getAuthenticatedUser() {
        Optional<User> user = userService.getAuthenticatedUser();
        if(user.get() != null) {
            return user.get();
        } else {
            return null;
        }
    }
}
