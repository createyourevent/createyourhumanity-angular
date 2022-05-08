package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KeyTableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KeyTable.class);
        KeyTable keyTable1 = new KeyTable();
        keyTable1.setId("id1");
        KeyTable keyTable2 = new KeyTable();
        keyTable2.setId(keyTable1.getId());
        assertThat(keyTable1).isEqualTo(keyTable2);
        keyTable2.setId("id2");
        assertThat(keyTable1).isNotEqualTo(keyTable2);
        keyTable1.setId(null);
        assertThat(keyTable1).isNotEqualTo(keyTable2);
    }
}
