package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.Mindmap;
import org.createyourhumanity.angular.repository.MindmapRepository;
import org.createyourhumanity.angular.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourhumanity.angular.domain.Mindmap}.
 */
@RestController
@RequestMapping("/api")
public class MindmapResource {

    private final Logger log = LoggerFactory.getLogger(MindmapResource.class);

    private static final String ENTITY_NAME = "mindmap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MindmapRepository mindmapRepository;

    public MindmapResource(MindmapRepository mindmapRepository) {
        this.mindmapRepository = mindmapRepository;
    }

    /**
     * {@code POST  /mindmaps} : Create a new mindmap.
     *
     * @param mindmap the mindmap to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mindmap, or with status {@code 400 (Bad Request)} if the mindmap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mindmaps")
    public ResponseEntity<Mindmap> createMindmap(@RequestBody Mindmap mindmap) throws URISyntaxException {
        log.debug("REST request to save Mindmap : {}", mindmap);
        if (mindmap.getId() != null) {
            throw new BadRequestAlertException("A new mindmap cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mindmap result = mindmapRepository.save(mindmap);
        return ResponseEntity
            .created(new URI("/api/mindmaps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /mindmaps/:id} : Updates an existing mindmap.
     *
     * @param id the id of the mindmap to save.
     * @param mindmap the mindmap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindmap,
     * or with status {@code 400 (Bad Request)} if the mindmap is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mindmap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mindmaps/{id}")
    public ResponseEntity<Mindmap> updateMindmap(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Mindmap mindmap
    ) throws URISyntaxException {
        log.debug("REST request to update Mindmap : {}, {}", id, mindmap);
        if (mindmap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindmap.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindmapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mindmap result = mindmapRepository.save(mindmap);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mindmap.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /mindmaps/:id} : Partial updates given fields of an existing mindmap, field will ignore if it is null
     *
     * @param id the id of the mindmap to save.
     * @param mindmap the mindmap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindmap,
     * or with status {@code 400 (Bad Request)} if the mindmap is not valid,
     * or with status {@code 404 (Not Found)} if the mindmap is not found,
     * or with status {@code 500 (Internal Server Error)} if the mindmap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mindmaps/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mindmap> partialUpdateMindmap(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Mindmap mindmap
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mindmap partially : {}, {}", id, mindmap);
        if (mindmap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindmap.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindmapRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mindmap> result = mindmapRepository
            .findById(mindmap.getId())
            .map(existingMindmap -> {
                if (mindmap.getText() != null) {
                    existingMindmap.setText(mindmap.getText());
                }
                if (mindmap.getModified() != null) {
                    existingMindmap.setModified(mindmap.getModified());
                }

                return existingMindmap;
            })
            .map(mindmapRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mindmap.getId()));
    }

    /**
     * {@code GET  /mindmaps} : get all the mindmaps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mindmaps in body.
     */
    @GetMapping("/mindmaps")
    public List<Mindmap> getAllMindmaps() {
        log.debug("REST request to get all Mindmaps");
        return mindmapRepository.findAll();
    }

    /**
     * {@code GET  /mindmaps/:id} : get the "id" mindmap.
     *
     * @param id the id of the mindmap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mindmap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mindmaps/{id}")
    public ResponseEntity<Mindmap> getMindmap(@PathVariable String id) {
        log.debug("REST request to get Mindmap : {}", id);
        Optional<Mindmap> mindmap = mindmapRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mindmap);
    }

    /**
     * {@code DELETE  /mindmaps/:id} : delete the "id" mindmap.
     *
     * @param id the id of the mindmap to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mindmaps/{id}")
    public ResponseEntity<Void> deleteMindmap(@PathVariable String id) {
        log.debug("REST request to delete Mindmap : {}", id);
        mindmapRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
