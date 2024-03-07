package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.createyourhumanity.angular.domain.GrantsLevel;
import org.createyourhumanity.angular.domain.VisibilityStatus;
import org.createyourhumanity.angular.repository.VisibilityStatusExtRepository;
import org.createyourhumanity.angular.repository.VisibilityStatusRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.VisibilityStatus}.
 */
@RestController
@RequestMapping("/api")
public class VisibilityStatusExtResource {

    private final Logger log = LoggerFactory.getLogger(VisibilityStatusResource.class);

    private static final String ENTITY_NAME = "visibilityStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VisibilityStatusExtRepository visibilityStatusExtRepository;

    public VisibilityStatusExtResource(VisibilityStatusExtRepository visibilityStatusExtRepository) {
        this.visibilityStatusExtRepository = visibilityStatusExtRepository;
    }

    @GetMapping("/visibility-status/{userId}/findByUserId")
    public VisibilityStatus getUserMindmap(@PathVariable String userId) {
        log.debug("REST request to get Visiblity by UserId : {}", userId);
        VisibilityStatus vs = visibilityStatusExtRepository.findByUser(userId);
        return vs;
    }
}
