package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.UserMindmap;
import org.createyourhumanity.angular.repository.UserMindmapExtRepository;
import org.createyourhumanity.angular.repository.UserMindmapRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.UserMindmap}.
 */
@RestController
@RequestMapping("/api")
public class UserMindmapExtResource {

    private final Logger log = LoggerFactory.getLogger(UserMindmapResource.class);

    private static final String ENTITY_NAME = "userMindmap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserMindmapExtRepository userMindmapExtRepository;

    public UserMindmapExtResource(UserMindmapExtRepository userMindmapExtRepository) {
        this.userMindmapExtRepository = userMindmapExtRepository;
    }

    /**
     * {@code GET  /user-mindmaps/:id} : get the "id" userMindmap.
     *
     * @param id the id of the userMindmap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userMindmap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-mindmaps/{userId}/findByUserId")
    public UserMindmap getUserMindmap(@PathVariable String userId) {
        log.debug("REST request to get UserMindmap by UserId : {}", userId);
        UserMindmap userMindmap = userMindmapExtRepository.findByUser(userId);
        return userMindmap;
    }
}
