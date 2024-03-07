package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrantsLevelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GrantsLevel.class);
        GrantsLevel grantsLevel1 = new GrantsLevel();
        grantsLevel1.setId("id1");
        GrantsLevel grantsLevel2 = new GrantsLevel();
        grantsLevel2.setId(grantsLevel1.getId());
        assertThat(grantsLevel1).isEqualTo(grantsLevel2);
        grantsLevel2.setId("id2");
        assertThat(grantsLevel1).isNotEqualTo(grantsLevel2);
        grantsLevel1.setId(null);
        assertThat(grantsLevel1).isNotEqualTo(grantsLevel2);
    }
}
