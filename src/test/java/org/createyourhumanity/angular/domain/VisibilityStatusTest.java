package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VisibilityStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VisibilityStatus.class);
        VisibilityStatus visibilityStatus1 = new VisibilityStatus();
        visibilityStatus1.setId("id1");
        VisibilityStatus visibilityStatus2 = new VisibilityStatus();
        visibilityStatus2.setId(visibilityStatus1.getId());
        assertThat(visibilityStatus1).isEqualTo(visibilityStatus2);
        visibilityStatus2.setId("id2");
        assertThat(visibilityStatus1).isNotEqualTo(visibilityStatus2);
        visibilityStatus1.setId(null);
        assertThat(visibilityStatus1).isNotEqualTo(visibilityStatus2);
    }
}
