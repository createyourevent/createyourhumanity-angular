package org.createyourhumanity.angular.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourhumanity.angular.domain.Mindmap;
import org.createyourhumanity.angular.domain.UserMindmap;
import org.createyourhumanity.angular.repository.MindmapRepository;
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
 * REST controller for managing {@link org.createyourhumanity.angular.domain.Mindmap}.
 */
@RestController
@RequestMapping("/api")
public class MindmapExtResource {

    private final Logger log = LoggerFactory.getLogger(MindmapExtResource.class);

    private static final String ENTITY_NAME = "mindmap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MindmapRepository mindmapRepository;

    private final UserMindmapRepository userMindmapRepository;

    public MindmapExtResource(MindmapRepository mindmapRepository,UserMindmapRepository userMindmapRepository) {
        this.mindmapRepository = mindmapRepository;
        this.userMindmapRepository = userMindmapRepository;
    }

    @GetMapping("/mindmaps/{mapId}/{global}/xml")
    public String getXML(@PathVariable String mapId, @PathVariable Boolean global ) {

        Optional<Mindmap> mindmap = null;
        Optional<UserMindmap> usermindmap = null;
        if(global) {
            mindmap = mindmapRepository.findById(mapId);
        } else {
            usermindmap = userMindmapRepository.findById(mapId);
        }

        log.debug("REST request to get Mindmap : {}", mapId);

        if(global) {
            return mindmap.get().getText();
        } else {
            return usermindmap.get().getText();
        }

    }

    @PutMapping("/mindmaps/{id}/{global}/saveXml")
    public void updateMindmap(
        @PathVariable(value = "id", required = false) final String id,
        @PathVariable Boolean global,
        @RequestBody Mindmap mindmap
    ) throws URISyntaxException {
        log.debug("REST request to update Mindmap : {}, {}", id, mindmap);

        if(global) {
            mindmapRepository.save(mindmap);
        } else {
            UserMindmap usermindmap = userMindmapRepository.findById(id).get();
            usermindmap.setText(mindmap.getText());
            userMindmapRepository.save(usermindmap);
        }


    }
}
