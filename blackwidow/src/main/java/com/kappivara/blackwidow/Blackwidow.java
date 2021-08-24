package com.kappivara.blackwidow;

import com.kappivara.blackwidow.consumers.SqsConsumer;
import com.kappivara.blackwidow.interfaces.MessageConsumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.regions.Region;

@Component
public class Blackwidow {
    @Autowired
    Environment env;

    @EventListener(ApplicationReadyEvent.class)
    void main() {
        String sqsUrl = env.getProperty("aws.sqsUrl");
        String sqsQueueUrl = env.getProperty("aws.sqsQueueUrl");
        Region awsRegion =  Region.of(env.getProperty("aws.region"));

        MessageConsumer consumer = new SqsConsumer(sqsUrl, sqsQueueUrl, awsRegion);
        consumer.consume();
    }
}
