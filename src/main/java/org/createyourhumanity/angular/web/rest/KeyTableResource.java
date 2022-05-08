package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.KeyTable;
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
public class KeyTableResource {

    private final Logger log = LoggerFactory.getLogger(KeyTableResource.class);

    private static final String ENTITY_NAME = "keyTable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KeyTableRepository keyTableRepository;

    public KeyTableResource(KeyTableRepository keyTableRepository) {
        this.keyTableRepository = keyTableRepository;
    }

    /**
     * {@code POST  /key-tables} : Create a new keyTable.
     *
     * @param keyTable the keyTable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new keyTable, or with status {@code 400 (Bad Request)} if the keyTable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/key-tables")
    public ResponseEntity<KeyTable> createKeyTable(@RequestBody KeyTable keyTable) throws URISyntaxException {
        log.debug("REST request to save KeyTable : {}", keyTable);
        if (keyTable.getId() != null) {
            throw new BadRequestAlertException("A new keyTable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KeyTable result = keyTableRepository.save(keyTable);
        return ResponseEntity
            .created(new URI("/api/key-tables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /key-tables/:id} : Updates an existing keyTable.
     *
     * @param id the id of the keyTable to save.
     * @param keyTable the keyTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated keyTable,
     * or with status {@code 400 (Bad Request)} if the keyTable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the keyTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/key-tables/{id}")
    public ResponseEntity<KeyTable> updateKeyTable(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody KeyTable keyTable
    ) throws URISyntaxException {
        log.debug("REST request to update KeyTable : {}, {}", id, keyTable);
        if (keyTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, keyTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!keyTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KeyTable result = keyTableRepository.save(keyTable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, keyTable.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /key-tables/:id} : Partial updates given fields of an existing keyTable, field will ignore if it is null
     *
     * @param id the id of the keyTable to save.
     * @param keyTable the keyTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated keyTable,
     * or with status {@code 400 (Bad Request)} if the keyTable is not valid,
     * or with status {@code 404 (Not Found)} if the keyTable is not found,
     * or with status {@code 500 (Internal Server Error)} if the keyTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/key-tables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KeyTable> partialUpdateKeyTable(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody KeyTable keyTable
    ) throws URISyntaxException {
        log.debug("REST request to partial update KeyTable partially : {}, {}", id, keyTable);
        if (keyTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, keyTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!keyTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KeyTable> result = keyTableRepository
            .findById(keyTable.getId())
            .map(existingKeyTable -> {
                if (keyTable.getKey() != null) {
                    existingKeyTable.setKey(keyTable.getKey());
                }
                if (keyTable.getCreated() != null) {
                    existingKeyTable.setCreated(keyTable.getCreated());
                }
                if (keyTable.getModified() != null) {
                    existingKeyTable.setModified(keyTable.getModified());
                }

                return existingKeyTable;
            })
            .map(keyTableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, keyTable.getId())
        );
    }

    /**
     * {@code GET  /key-tables} : get all the keyTables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of keyTables in body.
     */
    @GetMapping("/key-tables")
    public List<KeyTable> getAllKeyTables() {
        log.debug("REST request to get all KeyTables");
        return keyTableRepository.findAll();
    }

    /**
     * {@code GET  /key-tables/:id} : get the "id" keyTable.
     *
     * @param id the id of the keyTable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the keyTable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/key-tables/{id}")
    public ResponseEntity<KeyTable> getKeyTable(@PathVariable String id) {
        log.debug("REST request to get KeyTable : {}", id);
        Optional<KeyTable> keyTable = keyTableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(keyTable);
    }

    /**
     * {@code DELETE  /key-tables/:id} : delete the "id" keyTable.
     *
     * @param id the id of the keyTable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/key-tables/{id}")
    public ResponseEntity<Void> deleteKeyTable(@PathVariable String id) {
        log.debug("REST request to delete KeyTable : {}", id);
        keyTableRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
