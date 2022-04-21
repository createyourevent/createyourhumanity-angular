package org.createyourhumanity.angular.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.createyourhumanity.angular.web.rest.TestUtil.sameInstant;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.createyourhumanity.angular.IntegrationTest;
import org.createyourhumanity.angular.domain.Mindmap;
import org.createyourhumanity.angular.repository.MindmapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link MindmapResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MindmapResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/mindmaps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private MindmapRepository mindmapRepository;

    @Autowired
    private MockMvc restMindmapMockMvc;

    private Mindmap mindmap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mindmap createEntity() {
        Mindmap mindmap = new Mindmap().text(DEFAULT_TEXT).modified(DEFAULT_MODIFIED);
        return mindmap;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mindmap createUpdatedEntity() {
        Mindmap mindmap = new Mindmap().text(UPDATED_TEXT).modified(UPDATED_MODIFIED);
        return mindmap;
    }

    @BeforeEach
    public void initTest() {
        mindmapRepository.deleteAll();
        mindmap = createEntity();
    }

    @Test
    void createMindmap() throws Exception {
        int databaseSizeBeforeCreate = mindmapRepository.findAll().size();
        // Create the Mindmap
        restMindmapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isCreated());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeCreate + 1);
        Mindmap testMindmap = mindmapList.get(mindmapList.size() - 1);
        assertThat(testMindmap.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testMindmap.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createMindmapWithExistingId() throws Exception {
        // Create the Mindmap with an existing ID
        mindmap.setId("existing_id");

        int databaseSizeBeforeCreate = mindmapRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMindmapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllMindmaps() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        // Get all the mindmapList
        restMindmapMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mindmap.getId())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getMindmap() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        // Get the mindmap
        restMindmapMockMvc
            .perform(get(ENTITY_API_URL_ID, mindmap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mindmap.getId()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingMindmap() throws Exception {
        // Get the mindmap
        restMindmapMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewMindmap() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();

        // Update the mindmap
        Mindmap updatedMindmap = mindmapRepository.findById(mindmap.getId()).get();
        updatedMindmap.text(UPDATED_TEXT).modified(UPDATED_MODIFIED);

        restMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMindmap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMindmap))
            )
            .andExpect(status().isOk());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
        Mindmap testMindmap = mindmapList.get(mindmapList.size() - 1);
        assertThat(testMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testMindmap.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mindmap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateMindmapWithPatch() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();

        // Update the mindmap using partial update
        Mindmap partialUpdatedMindmap = new Mindmap();
        partialUpdatedMindmap.setId(mindmap.getId());

        partialUpdatedMindmap.text(UPDATED_TEXT).modified(UPDATED_MODIFIED);

        restMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindmap))
            )
            .andExpect(status().isOk());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
        Mindmap testMindmap = mindmapList.get(mindmapList.size() - 1);
        assertThat(testMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testMindmap.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void fullUpdateMindmapWithPatch() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();

        // Update the mindmap using partial update
        Mindmap partialUpdatedMindmap = new Mindmap();
        partialUpdatedMindmap.setId(mindmap.getId());

        partialUpdatedMindmap.text(UPDATED_TEXT).modified(UPDATED_MODIFIED);

        restMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindmap))
            )
            .andExpect(status().isOk());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
        Mindmap testMindmap = mindmapList.get(mindmapList.size() - 1);
        assertThat(testMindmap.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testMindmap.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mindmap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamMindmap() throws Exception {
        int databaseSizeBeforeUpdate = mindmapRepository.findAll().size();
        mindmap.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindmapMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindmap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mindmap in the database
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteMindmap() throws Exception {
        // Initialize the database
        mindmapRepository.save(mindmap);

        int databaseSizeBeforeDelete = mindmapRepository.findAll().size();

        // Delete the mindmap
        restMindmapMockMvc
            .perform(delete(ENTITY_API_URL_ID, mindmap.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mindmap> mindmapList = mindmapRepository.findAll();
        assertThat(mindmapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
