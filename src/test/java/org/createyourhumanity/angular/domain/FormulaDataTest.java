package org.createyourhumanity.angular.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourhumanity.angular.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormulaDataTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormulaData.class);
        FormulaData formulaData1 = new FormulaData();
        formulaData1.setId("id1");
        FormulaData formulaData2 = new FormulaData();
        formulaData2.setId(formulaData1.getId());
        assertThat(formulaData1).isEqualTo(formulaData2);
        formulaData2.setId("id2");
        assertThat(formulaData1).isNotEqualTo(formulaData2);
        formulaData1.setId(null);
        assertThat(formulaData1).isNotEqualTo(formulaData2);
    }
}
