package org.createyourhumanity.angular.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Mindmap.
 */
@Document(collection = "mindmap")
public class Mindmap implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("text")
    private String text;

    @Field("modified")
    private ZonedDateTime modified;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Mindmap id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public Mindmap text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public ZonedDateTime getModified() {
        return this.modified;
    }

    public Mindmap modified(ZonedDateTime modified) {
        this.setModified(modified);
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mindmap)) {
            return false;
        }
        return id != null && id.equals(((Mindmap) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mindmap{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", modified='" + getModified() + "'" +
            "}";
    }
}
