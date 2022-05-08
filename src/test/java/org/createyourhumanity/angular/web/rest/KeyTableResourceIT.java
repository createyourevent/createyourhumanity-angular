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
import org.createyourhumanity.angular.domain.KeyTable;
import org.createyourhumanity.angular.repository.KeyTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link KeyTableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KeyTableResourceIT {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/key-tables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private KeyTableRepository keyTableRepository;

    @Autowired
    private MockMvc restKeyTableMockMvc;

    private KeyTable keyTable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KeyTable createEntity() {
        KeyTable keyTable = new KeyTable().key(DEFAULT_KEY).created(DEFAULT_CREATED).modified(DEFAULT_MODIFIED);
        return keyTable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KeyTable createUpdatedEntity() {
        KeyTable keyTable = new KeyTable().key(UPDATED_KEY).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);
        return keyTable;
    }

    @BeforeEach
    public void initTest() {
        keyTableRepository.deleteAll();
        keyTable = createEntity();
    }

    @Test
    void createKeyTable() throws Exception {
        int databaseSizeBeforeCreate = keyTableRepository.findAll().size();
        // Create the KeyTable
        restKeyTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isCreated());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeCreate + 1);
        KeyTable testKeyTable = keyTableList.get(keyTableList.size() - 1);
        assertThat(testKeyTable.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testKeyTable.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testKeyTable.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void createKeyTableWithExistingId() throws Exception {
        // Create the KeyTable with an existing ID
        keyTable.setId("existing_id");

        int databaseSizeBeforeCreate = keyTableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKeyTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllKeyTables() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        // Get all the keyTableList
        restKeyTableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(keyTable.getId())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(sameInstant(DEFAULT_MODIFIED))));
    }

    @Test
    void getKeyTable() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        // Get the keyTable
        restKeyTableMockMvc
            .perform(get(ENTITY_API_URL_ID, keyTable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(keyTable.getId()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.modified").value(sameInstant(DEFAULT_MODIFIED)));
    }

    @Test
    void getNonExistingKeyTable() throws Exception {
        // Get the keyTable
        restKeyTableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewKeyTable() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();

        // Update the keyTable
        KeyTable updatedKeyTable = keyTableRepository.findById(keyTable.getId()).get();
        updatedKeyTable.key(UPDATED_KEY).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restKeyTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKeyTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKeyTable))
            )
            .andExpect(status().isOk());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
        KeyTable testKeyTable = keyTableList.get(keyTableList.size() - 1);
        assertThat(testKeyTable.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testKeyTable.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testKeyTable.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void putNonExistingKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, keyTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateKeyTableWithPatch() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();

        // Update the keyTable using partial update
        KeyTable partialUpdatedKeyTable = new KeyTable();
        partialUpdatedKeyTable.setId(keyTable.getId());

        restKeyTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeyTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeyTable))
            )
            .andExpect(status().isOk());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
        KeyTable testKeyTable = keyTableList.get(keyTableList.size() - 1);
        assertThat(testKeyTable.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testKeyTable.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testKeyTable.getModified()).isEqualTo(DEFAULT_MODIFIED);
    }

    @Test
    void fullUpdateKeyTableWithPatch() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();

        // Update the keyTable using partial update
        KeyTable partialUpdatedKeyTable = new KeyTable();
        partialUpdatedKeyTable.setId(keyTable.getId());

        partialUpdatedKeyTable.key(UPDATED_KEY).created(UPDATED_CREATED).modified(UPDATED_MODIFIED);

        restKeyTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeyTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeyTable))
            )
            .andExpect(status().isOk());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
        KeyTable testKeyTable = keyTableList.get(keyTableList.size() - 1);
        assertThat(testKeyTable.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testKeyTable.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testKeyTable.getModified()).isEqualTo(UPDATED_MODIFIED);
    }

    @Test
    void patchNonExistingKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, keyTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamKeyTable() throws Exception {
        int databaseSizeBeforeUpdate = keyTableRepository.findAll().size();
        keyTable.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeyTableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keyTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KeyTable in the database
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteKeyTable() throws Exception {
        // Initialize the database
        keyTableRepository.save(keyTable);

        int databaseSizeBeforeDelete = keyTableRepository.findAll().size();

        // Delete the keyTable
        restKeyTableMockMvc
            .perform(delete(ENTITY_API_URL_ID, keyTable.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KeyTable> keyTableList = keyTableRepository.findAll();
        assertThat(keyTableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
