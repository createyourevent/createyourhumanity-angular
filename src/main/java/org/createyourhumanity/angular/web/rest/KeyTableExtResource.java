package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.KeyTable;
import org.createyourhumanity.angular.repository.KeyTableExtRepository;
import org.createyourhumanity.angular.repository.KeyTableRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.KeyTable}.
 */
@RestController
@RequestMapping("/api")
public class KeyTableExtResource {

    private final Logger log = LoggerFactory.getLogger(KeyTableResource.class);

    private static final String ENTITY_NAME = "keyTable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KeyTableExtRepository keyTableExtRepository;

    public KeyTableExtResource(KeyTableExtRepository keyTableExtRepository) {
        this.keyTableExtRepository = keyTableExtRepository;
    }

    @GetMapping("/key-tables/{key}/findByKey")
    public KeyTable getKey(@PathVariable String key) {
        log.debug("REST request to getKeyTable by Key : {}", key);
        KeyTable fd = keyTableExtRepository.findByKey(key);
        return fd;
    }

    @DeleteMapping("/key-tables/deleteAll")
    public void deleteAllKeyTable() {
        log.debug("REST request to delete all in KeyTable : {}");
        keyTableExtRepository.deleteAll();
    }
}
