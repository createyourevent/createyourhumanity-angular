package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.domain.GrantsLevel;
import org.createyourhumanity.angular.repository.GrantsLevelExtRepository;
import org.createyourhumanity.angular.repository.GrantsLevelRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.GrantsLevel}.
 */
@RestController
@RequestMapping("/api")
public class GrantsLevelExtResource {

    private final Logger log = LoggerFactory.getLogger(GrantsLevelResource.class);

    private static final String ENTITY_NAME = "grantsLevel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrantsLevelExtRepository grantsLevelExtRepository;

    public GrantsLevelExtResource(GrantsLevelExtRepository grantsLevelExtRepository) {
        this.grantsLevelExtRepository = grantsLevelExtRepository;
    }

    @GetMapping("/grants-level/{userId}/findByUserId")
    public GrantsLevel getUserMindmap(@PathVariable String userId) {
        log.debug("REST request to get FormulaData by UserId : {}", userId);
        GrantsLevel gl = grantsLevelExtRepository.findByUser(userId);
        return gl;
    }

}
