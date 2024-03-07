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
import org.createyourhumanity.angular.domain.VisibilityStatus;
import org.createyourhumanity.angular.repository.VisibilityStatusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link VisibilityStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VisibilityStatusResourceIT {

    private static final String DEFAULT_MAP = "AAAAAAAAAA";
    private static final String UPDATED_MAP = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/visibility-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private VisibilityStatusRepository visibilityStatusRepository;

    @Autowired
    private MockMvc restVisibilityStatusMockMvc;

    private VisibilityStatus visibilityStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VisibilityStatus createEntity() {
        VisibilityStatus visibilityStatus = new VisibilityStatus().map(DEFAULT_MAP).created(DEFAULT_CREATED).modified(DEFAULT_MODIFIED);
        return visibilityStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VisibilityStatus createUpdatedEntity() {
        VisibilityStatus visibilityStatus = new VisibilityStatus().map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);
        return visibilityStatus;
    }

    @BeforeEach
    public void initTest() {
        visibilityStatusRepository.deleteAll();
        visibilityStatus = createEntity();
    }

    @Test
    void createVisibilityStatus() throws Exception {
        int databaseSizeBeforeCreate = visibilityStatusRepository.findAll().size();
        // Create the VisibilityStatus
        restVisibilityStatusMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isCreated());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeCreate + 1);
        VisibilityStatus testVisibilityStatus = visibilityStatusList.get(visibilityStatusList.size() - 1);
        assertThat(testVisibilityStatus.getMap()).isEqualTo(DEFAULT_MAP);
        assertThat(testVisibilityStatus.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testVisibilityStatus.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createVisibilityStatusWithExistingId() throws Exception {
        // Create the VisibilityStatus with an existing ID
        visibilityStatus.setId("existing_id");

        int databaseSizeBeforeCreate = visibilityStatusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVisibilityStatusMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllVisibilityStatuses() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        // Get all the visibilityStatusList
        restVisibilityStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visibilityStatus.getId())))
            .andExpect(jsonPath("$.[*].map").value(hasItem(DEFAULT_MAP)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getVisibilityStatus() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        // Get the visibilityStatus
        restVisibilityStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, visibilityStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(visibilityStatus.getId()))
            .andExpect(jsonPath("$.map").value(DEFAULT_MAP))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingVisibilityStatus() throws Exception {
        // Get the visibilityStatus
        restVisibilityStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewVisibilityStatus() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();

        // Update the visibilityStatus
        VisibilityStatus updatedVisibilityStatus = visibilityStatusRepository.findById(visibilityStatus.getId()).get();
        updatedVisibilityStatus.map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restVisibilityStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVisibilityStatus.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVisibilityStatus))
            )
            .andExpect(status().isOk());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
        VisibilityStatus testVisibilityStatus = visibilityStatusList.get(visibilityStatusList.size() - 1);
        assertThat(testVisibilityStatus.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testVisibilityStatus.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testVisibilityStatus.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visibilityStatus.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateVisibilityStatusWithPatch() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();

        // Update the visibilityStatus using partial update
        VisibilityStatus partialUpdatedVisibilityStatus = new VisibilityStatus();
        partialUpdatedVisibilityStatus.setId(visibilityStatus.getId());

        partialUpdatedVisibilityStatus.map(UPDATED_MAP).modified(UPDATED_MODIFIED);

        restVisibilityStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisibilityStatus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisibilityStatus))
            )
            .andExpect(status().isOk());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
        VisibilityStatus testVisibilityStatus = visibilityStatusList.get(visibilityStatusList.size() - 1);
        assertThat(testVisibilityStatus.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testVisibilityStatus.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testVisibilityStatus.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void fullUpdateVisibilityStatusWithPatch() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();

        // Update the visibilityStatus using partial update
        VisibilityStatus partialUpdatedVisibilityStatus = new VisibilityStatus();
        partialUpdatedVisibilityStatus.setId(visibilityStatus.getId());

        partialUpdatedVisibilityStatus.map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restVisibilityStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisibilityStatus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisibilityStatus))
            )
            .andExpect(status().isOk());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
        VisibilityStatus testVisibilityStatus = visibilityStatusList.get(visibilityStatusList.size() - 1);
        assertThat(testVisibilityStatus.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testVisibilityStatus.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testVisibilityStatus.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, visibilityStatus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamVisibilityStatus() throws Exception {
        int databaseSizeBeforeUpdate = visibilityStatusRepository.findAll().size();
        visibilityStatus.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisibilityStatusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visibilityStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VisibilityStatus in the database
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteVisibilityStatus() throws Exception {
        // Initialize the database
        visibilityStatusRepository.save(visibilityStatus);

        int databaseSizeBeforeDelete = visibilityStatusRepository.findAll().size();

        // Delete the visibilityStatus
        restVisibilityStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, visibilityStatus.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VisibilityStatus> visibilityStatusList = visibilityStatusRepository.findAll();
        assertThat(visibilityStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
