package org.createyourhumanity.angular.web.rest;

import java.util.*;

import org.createyourhumanity.angular.domain.User;
import org.createyourhumanity.angular.service.UserExtService;
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
public class UserExtResource {

    private final Logger log = LoggerFactory.getLogger(UserExtResource.class);

    private final UserExtService userExtService;

    public UserExtResource(UserExtService userExtService) {
        this.userExtService = userExtService;
    }

    @GetMapping("/authenticatedUserWidthFormulaData")
    public User getAuthenticatedUserWidthFormulaData() {
        User user = userExtService.getAuthenticatedUserWithFormulaData();
        return user;
    }

    @GetMapping("/allUsersWidthFormulaData")
    public List<User> getAllUsersWithFormulaData() {
        List<User> users = userExtService.getAllUsersWithFormulaData();
        return users;
    }

    @GetMapping("/allUsersWidthFormulaDataAndFriends")
    public List<User> getAllUsersWithFormulaDataAndFriends() {
        List<User> users = userExtService.getAllUsersWithFormulaData();
        return users;
    }

    @GetMapping("/users/{userId}/getUserWithUserId")
    public User getUserWithUserId(@PathVariable String userId) {
        return this.userExtService.getUserWithUserId(userId);
    }


    @GetMapping("/authenticatedUserWithDescription")
    public User getUserWithDescription() {
        User user = userExtService.findUserByLoginAndActivatedIsTrue();
        return user;
    }

}
