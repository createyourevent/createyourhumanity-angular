package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.GrantsLevel;
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
public class GrantsLevelResource {

    private final Logger log = LoggerFactory.getLogger(GrantsLevelResource.class);

    private static final String ENTITY_NAME = "grantsLevel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrantsLevelRepository grantsLevelRepository;

    public GrantsLevelResource(GrantsLevelRepository grantsLevelRepository) {
        this.grantsLevelRepository = grantsLevelRepository;
    }

    /**
     * {@code POST  /grants-levels} : Create a new grantsLevel.
     *
     * @param grantsLevel the grantsLevel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grantsLevel, or with status {@code 400 (Bad Request)} if the grantsLevel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grants-levels")
    public ResponseEntity<GrantsLevel> createGrantsLevel(@RequestBody GrantsLevel grantsLevel) throws URISyntaxException {
        log.debug("REST request to save GrantsLevel : {}", grantsLevel);
        if (grantsLevel.getId() != null) {
            throw new BadRequestAlertException("A new grantsLevel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GrantsLevel result = grantsLevelRepository.save(grantsLevel);
        return ResponseEntity
            .created(new URI("/api/grants-levels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /grants-levels/:id} : Updates an existing grantsLevel.
     *
     * @param id the id of the grantsLevel to save.
     * @param grantsLevel the grantsLevel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grantsLevel,
     * or with status {@code 400 (Bad Request)} if the grantsLevel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grantsLevel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grants-levels/{id}")
    public ResponseEntity<GrantsLevel> updateGrantsLevel(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody GrantsLevel grantsLevel
    ) throws URISyntaxException {
        log.debug("REST request to update GrantsLevel : {}, {}", id, grantsLevel);
        if (grantsLevel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grantsLevel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grantsLevelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GrantsLevel result = grantsLevelRepository.save(grantsLevel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grantsLevel.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /grants-levels/:id} : Partial updates given fields of an existing grantsLevel, field will ignore if it is null
     *
     * @param id the id of the grantsLevel to save.
     * @param grantsLevel the grantsLevel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grantsLevel,
     * or with status {@code 400 (Bad Request)} if the grantsLevel is not valid,
     * or with status {@code 404 (Not Found)} if the grantsLevel is not found,
     * or with status {@code 500 (Internal Server Error)} if the grantsLevel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grants-levels/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GrantsLevel> partialUpdateGrantsLevel(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody GrantsLevel grantsLevel
    ) throws URISyntaxException {
        log.debug("REST request to partial update GrantsLevel partially : {}, {}", id, grantsLevel);
        if (grantsLevel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grantsLevel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grantsLevelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GrantsLevel> result = grantsLevelRepository
            .findById(grantsLevel.getId())
            .map(existingGrantsLevel -> {
                if (grantsLevel.getMap() != null) {
                    existingGrantsLevel.setMap(grantsLevel.getMap());
                }
                if (grantsLevel.getCreated() != null) {
                    existingGrantsLevel.setCreated(grantsLevel.getCreated());
                }
                if (grantsLevel.getModified() != null) {
                    existingGrantsLevel.setModified(grantsLevel.getModified());
                }

                return existingGrantsLevel;
            })
            .map(grantsLevelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grantsLevel.getId())
        );
    }

    /**
     * {@code GET  /grants-levels} : get all the grantsLevels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grantsLevels in body.
     */
    @GetMapping("/grants-levels")
    public List<GrantsLevel> getAllGrantsLevels() {
        log.debug("REST request to get all GrantsLevels");
        return grantsLevelRepository.findAll();
    }

    /**
     * {@code GET  /grants-levels/:id} : get the "id" grantsLevel.
     *
     * @param id the id of the grantsLevel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grantsLevel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grants-levels/{id}")
    public ResponseEntity<GrantsLevel> getGrantsLevel(@PathVariable String id) {
        log.debug("REST request to get GrantsLevel : {}", id);
        Optional<GrantsLevel> grantsLevel = grantsLevelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grantsLevel);
    }

    /**
     * {@code DELETE  /grants-levels/:id} : delete the "id" grantsLevel.
     *
     * @param id the id of the grantsLevel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grants-levels/{id}")
    public ResponseEntity<Void> deleteGrantsLevel(@PathVariable String id) {
        log.debug("REST request to delete GrantsLevel : {}", id);
        grantsLevelRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
