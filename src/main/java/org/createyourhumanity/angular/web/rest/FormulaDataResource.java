package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.FormulaData;
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
public class FormulaDataResource {

    private final Logger log = LoggerFactory.getLogger(FormulaDataResource.class);

    private static final String ENTITY_NAME = "formulaData";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormulaDataRepository formulaDataRepository;

    public FormulaDataResource(FormulaDataRepository formulaDataRepository) {
        this.formulaDataRepository = formulaDataRepository;
    }

    /**
     * {@code POST  /formula-data} : Create a new formulaData.
     *
     * @param formulaData the formulaData to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formulaData, or with status {@code 400 (Bad Request)} if the formulaData has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formula-data")
    public ResponseEntity<FormulaData> createFormulaData(@RequestBody FormulaData formulaData) throws URISyntaxException {
        log.debug("REST request to save FormulaData : {}", formulaData);
        if (formulaData.getId() != null) {
            throw new BadRequestAlertException("A new formulaData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormulaData result = formulaDataRepository.save(formulaData);
        return ResponseEntity
            .created(new URI("/api/formula-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /formula-data/:id} : Updates an existing formulaData.
     *
     * @param id the id of the formulaData to save.
     * @param formulaData the formulaData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formulaData,
     * or with status {@code 400 (Bad Request)} if the formulaData is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formulaData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formula-data/{id}")
    public ResponseEntity<FormulaData> updateFormulaData(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody FormulaData formulaData
    ) throws URISyntaxException {
        log.debug("REST request to update FormulaData : {}, {}", id, formulaData);
        if (formulaData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formulaData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formulaDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormulaData result = formulaDataRepository.save(formulaData);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formulaData.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /formula-data/:id} : Partial updates given fields of an existing formulaData, field will ignore if it is null
     *
     * @param id the id of the formulaData to save.
     * @param formulaData the formulaData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formulaData,
     * or with status {@code 400 (Bad Request)} if the formulaData is not valid,
     * or with status {@code 404 (Not Found)} if the formulaData is not found,
     * or with status {@code 500 (Internal Server Error)} if the formulaData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formula-data/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormulaData> partialUpdateFormulaData(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody FormulaData formulaData
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormulaData partially : {}, {}", id, formulaData);
        if (formulaData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formulaData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formulaDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormulaData> result = formulaDataRepository
            .findById(formulaData.getId())
            .map(existingFormulaData -> {
                if (formulaData.getMap() != null) {
                    existingFormulaData.setMap(formulaData.getMap());
                }
                if (formulaData.getGrant() != null) {
                    existingFormulaData.setGrant(formulaData.getGrant());
                }
                if (formulaData.getGroup() != null) {
                    existingFormulaData.setGroup(formulaData.getGroup());
                }
                if (formulaData.getVisible() != null) {
                    existingFormulaData.setVisible(formulaData.getVisible());
                }
                if (formulaData.getCreated() != null) {
                    existingFormulaData.setCreated(formulaData.getCreated());
                }
                if (formulaData.getModified() != null) {
                    existingFormulaData.setModified(formulaData.getModified());
                }

                return existingFormulaData;
            })
            .map(formulaDataRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formulaData.getId())
        );
    }

    /**
     * {@code GET  /formula-data} : get all the formulaData.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formulaData in body.
     */
    @GetMapping("/formula-data")
    public List<FormulaData> getAllFormulaData() {
        log.debug("REST request to get all FormulaData");
        return formulaDataRepository.findAll();
    }

    /**
     * {@code GET  /formula-data/:id} : get the "id" formulaData.
     *
     * @param id the id of the formulaData to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formulaData, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formula-data/{id}")
    public ResponseEntity<FormulaData> getFormulaData(@PathVariable String id) {
        log.debug("REST request to get FormulaData : {}", id);
        Optional<FormulaData> formulaData = formulaDataRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formulaData);
    }

    /**
     * {@code DELETE  /formula-data/:id} : delete the "id" formulaData.
     *
     * @param id the id of the formulaData to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formula-data/{id}")
    public ResponseEntity<Void> deleteFormulaData(@PathVariable String id) {
        log.debug("REST request to delete FormulaData : {}", id);
        formulaDataRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
