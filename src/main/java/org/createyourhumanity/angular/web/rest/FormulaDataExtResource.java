package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.FormulaData;
import org.createyourhumanity.angular.repository.FormulaDataExtRepository;
import org.createyourhumanity.angular.repository.FormulaDataRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.FormulaData}.
 */
@RestController
@RequestMapping("/api")
public class FormulaDataExtResource {

    private final Logger log = LoggerFactory.getLogger(FormulaDataResource.class);

    private static final String ENTITY_NAME = "formulaData";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormulaDataExtRepository formulaDataExtRepository;

    public FormulaDataExtResource(FormulaDataExtRepository formulaDataExtRepository) {
        this.formulaDataExtRepository = formulaDataExtRepository;
    }

    @GetMapping("/formula-data/{userId}/findByUserId")
    public FormulaData getUserMindmap(@PathVariable String userId) {
        log.debug("REST request to get FormulaData by UserId : {}", userId);
        FormulaData fd = formulaDataExtRepository.findByUser(userId);
        return fd;
    }
}
