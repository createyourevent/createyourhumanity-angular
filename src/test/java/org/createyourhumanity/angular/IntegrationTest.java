package org.createyourhumanity.angular;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.createyourhumanity.angular.CreateyourhumanityAngularApp;
import org.createyourhumanity.angular.MongoDbTestContainerExtension;
import org.createyourhumanity.angular.config.TestSecurityConfiguration;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { CreateyourhumanityAngularApp.class, TestSecurityConfiguration.class })
@ExtendWith(MongoDbTestContainerExtension.class)
public @interface IntegrationTest {
}
