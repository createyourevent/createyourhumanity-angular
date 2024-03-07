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
import org.createyourhumanity.angular.domain.GrantsLevel;
import org.createyourhumanity.angular.repository.GrantsLevelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link GrantsLevelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrantsLevelResourceIT {

    private static final String DEFAULT_MAP = "AAAAAAAAAA";
    private static final String UPDATED_MAP = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/grants-levels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private GrantsLevelRepository grantsLevelRepository;

    @Autowired
    private MockMvc restGrantsLevelMockMvc;

    private GrantsLevel grantsLevel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrantsLevel createEntity() {
        GrantsLevel grantsLevel = new GrantsLevel().map(DEFAULT_MAP).created(DEFAULT_CREATED).modified(DEFAULT_MODIFIED);
        return grantsLevel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrantsLevel createUpdatedEntity() {
        GrantsLevel grantsLevel = new GrantsLevel().map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);
        return grantsLevel;
    }

    @BeforeEach
    public void initTest() {
        grantsLevelRepository.deleteAll();
        grantsLevel = createEntity();
    }

    @Test
    void createGrantsLevel() throws Exception {
        int databaseSizeBeforeCreate = grantsLevelRepository.findAll().size();
        // Create the GrantsLevel
        restGrantsLevelMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isCreated());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeCreate + 1);
        GrantsLevel testGrantsLevel = grantsLevelList.get(grantsLevelList.size() - 1);
        assertThat(testGrantsLevel.getMap()).isEqualTo(DEFAULT_MAP);
        assertThat(testGrantsLevel.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testGrantsLevel.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createGrantsLevelWithExistingId() throws Exception {
        // Create the GrantsLevel with an existing ID
        grantsLevel.setId("existing_id");

        int databaseSizeBeforeCreate = grantsLevelRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrantsLevelMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllGrantsLevels() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        // Get all the grantsLevelList
        restGrantsLevelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grantsLevel.getId())))
            .andExpect(jsonPath("$.[*].map").value(hasItem(DEFAULT_MAP)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getGrantsLevel() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        // Get the grantsLevel
        restGrantsLevelMockMvc
            .perform(get(ENTITY_API_URL_ID, grantsLevel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grantsLevel.getId()))
            .andExpect(jsonPath("$.map").value(DEFAULT_MAP))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingGrantsLevel() throws Exception {
        // Get the grantsLevel
        restGrantsLevelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewGrantsLevel() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();

        // Update the grantsLevel
        GrantsLevel updatedGrantsLevel = grantsLevelRepository.findById(grantsLevel.getId()).get();
        updatedGrantsLevel.map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restGrantsLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrantsLevel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrantsLevel))
            )
            .andExpect(status().isOk());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
        GrantsLevel testGrantsLevel = grantsLevelList.get(grantsLevelList.size() - 1);
        assertThat(testGrantsLevel.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testGrantsLevel.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testGrantsLevel.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grantsLevel.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGrantsLevelWithPatch() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();

        // Update the grantsLevel using partial update
        GrantsLevel partialUpdatedGrantsLevel = new GrantsLevel();
        partialUpdatedGrantsLevel.setId(grantsLevel.getId());

        partialUpdatedGrantsLevel.created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restGrantsLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrantsLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrantsLevel))
            )
            .andExpect(status().isOk());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
        GrantsLevel testGrantsLevel = grantsLevelList.get(grantsLevelList.size() - 1);
        assertThat(testGrantsLevel.getMap()).isEqualTo(DEFAULT_MAP);
        assertThat(testGrantsLevel.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testGrantsLevel.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void fullUpdateGrantsLevelWithPatch() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();

        // Update the grantsLevel using partial update
        GrantsLevel partialUpdatedGrantsLevel = new GrantsLevel();
        partialUpdatedGrantsLevel.setId(grantsLevel.getId());

        partialUpdatedGrantsLevel.map(UPDATED_MAP).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restGrantsLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrantsLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrantsLevel))
            )
            .andExpect(status().isOk());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
        GrantsLevel testGrantsLevel = grantsLevelList.get(grantsLevelList.size() - 1);
        assertThat(testGrantsLevel.getMap()).isEqualTo(UPDATED_MAP);
        assertThat(testGrantsLevel.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testGrantsLevel.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grantsLevel.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGrantsLevel() throws Exception {
        int databaseSizeBeforeUpdate = grantsLevelRepository.findAll().size();
        grantsLevel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrantsLevelMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grantsLevel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrantsLevel in the database
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGrantsLevel() throws Exception {
        // Initialize the database
        grantsLevelRepository.save(grantsLevel);

        int databaseSizeBeforeDelete = grantsLevelRepository.findAll().size();

        // Delete the grantsLevel
        restGrantsLevelMockMvc
            .perform(delete(ENTITY_API_URL_ID, grantsLevel.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GrantsLevel> grantsLevelList = grantsLevelRepository.findAll();
        assertThat(grantsLevelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
