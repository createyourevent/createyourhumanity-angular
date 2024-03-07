package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.VisibilityStatus;
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
public class VisibilityStatusResource {

    private final Logger log = LoggerFactory.getLogger(VisibilityStatusResource.class);

    private static final String ENTITY_NAME = "visibilityStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VisibilityStatusRepository visibilityStatusRepository;

    public VisibilityStatusResource(VisibilityStatusRepository visibilityStatusRepository) {
        this.visibilityStatusRepository = visibilityStatusRepository;
    }

    /**
     * {@code POST  /visibility-statuses} : Create a new visibilityStatus.
     *
     * @param visibilityStatus the visibilityStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new visibilityStatus, or with status {@code 400 (Bad Request)} if the visibilityStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/visibility-statuses")
    public ResponseEntity<VisibilityStatus> createVisibilityStatus(@RequestBody VisibilityStatus visibilityStatus)
        throws URISyntaxException {
        log.debug("REST request to save VisibilityStatus : {}", visibilityStatus);
        if (visibilityStatus.getId() != null) {
            throw new BadRequestAlertException("A new visibilityStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VisibilityStatus result = visibilityStatusRepository.save(visibilityStatus);
        return ResponseEntity
            .created(new URI("/api/visibility-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /visibility-statuses/:id} : Updates an existing visibilityStatus.
     *
     * @param id the id of the visibilityStatus to save.
     * @param visibilityStatus the visibilityStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visibilityStatus,
     * or with status {@code 400 (Bad Request)} if the visibilityStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the visibilityStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/visibility-statuses/{id}")
    public ResponseEntity<VisibilityStatus> updateVisibilityStatus(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody VisibilityStatus visibilityStatus
    ) throws URISyntaxException {
        log.debug("REST request to update VisibilityStatus : {}, {}", id, visibilityStatus);
        if (visibilityStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visibilityStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visibilityStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VisibilityStatus result = visibilityStatusRepository.save(visibilityStatus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visibilityStatus.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /visibility-statuses/:id} : Partial updates given fields of an existing visibilityStatus, field will ignore if it is null
     *
     * @param id the id of the visibilityStatus to save.
     * @param visibilityStatus the visibilityStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visibilityStatus,
     * or with status {@code 400 (Bad Request)} if the visibilityStatus is not valid,
     * or with status {@code 404 (Not Found)} if the visibilityStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the visibilityStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/visibility-statuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VisibilityStatus> partialUpdateVisibilityStatus(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody VisibilityStatus visibilityStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update VisibilityStatus partially : {}, {}", id, visibilityStatus);
        if (visibilityStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visibilityStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visibilityStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VisibilityStatus> result = visibilityStatusRepository
            .findById(visibilityStatus.getId())
            .map(existingVisibilityStatus -> {
                if (visibilityStatus.getMap() != null) {
                    existingVisibilityStatus.setMap(visibilityStatus.getMap());
                }
                if (visibilityStatus.getCreated() != null) {
                    existingVisibilityStatus.setCreated(visibilityStatus.getCreated());
                }
                if (visibilityStatus.getModified() != null) {
                    existingVisibilityStatus.setModified(visibilityStatus.getModified());
                }

                return existingVisibilityStatus;
            })
            .map(visibilityStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visibilityStatus.getId())
        );
    }

    /**
     * {@code GET  /visibility-statuses} : get all the visibilityStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of visibilityStatuses in body.
     */
    @GetMapping("/visibility-statuses")
    public List<VisibilityStatus> getAllVisibilityStatuses() {
        log.debug("REST request to get all VisibilityStatuses");
        return visibilityStatusRepository.findAll();
    }

    /**
     * {@code GET  /visibility-statuses/:id} : get the "id" visibilityStatus.
     *
     * @param id the id of the visibilityStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the visibilityStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/visibility-statuses/{id}")
    public ResponseEntity<VisibilityStatus> getVisibilityStatus(@PathVariable String id) {
        log.debug("REST request to get VisibilityStatus : {}", id);
        Optional<VisibilityStatus> visibilityStatus = visibilityStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(visibilityStatus);
    }

    /**
     * {@code DELETE  /visibility-statuses/:id} : delete the "id" visibilityStatus.
     *
     * @param id the id of the visibilityStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/visibility-statuses/{id}")
    public ResponseEntity<Void> deleteVisibilityStatus(@PathVariable String id) {
        log.debug("REST request to delete VisibilityStatus : {}", id);
        visibilityStatusRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
