package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MindmapTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mindmap.class);
        Mindmap mindmap1 = new Mindmap();
        mindmap1.setId("id1");
        Mindmap mindmap2 = new Mindmap();
        mindmap2.setId(mindmap1.getId());
        assertThat(mindmap1).isEqualTo(mindmap2);
        mindmap2.setId("id2");
        assertThat(mindmap1).isNotEqualTo(mindmap2);
        mindmap1.setId(null);
        assertThat(mindmap1).isNotEqualTo(mindmap2);
    }
}
