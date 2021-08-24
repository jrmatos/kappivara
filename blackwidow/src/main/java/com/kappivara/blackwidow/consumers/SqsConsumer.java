package com.kappivara.blackwidow.consumers;

import com.kappivara.blackwidow.interfaces.MessageConsumer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;

import java.net.URI;

public class SqsConsumer implements MessageConsumer {
    private final String sqsUrl;
    private final String queueUrl;
    private final Region awsRegion;
    private final ReceiveMessageRequest receiveMessageRequest;
    private SqsClient sqsClient;

    public SqsConsumer(String sqsUrl, String queueUrl, Region awsRegion) {
        this.sqsUrl = sqsUrl;
        this.queueUrl = queueUrl;
        this.awsRegion = awsRegion;

        sqsClient = buildSqsClient();
        receiveMessageRequest = buildReceiveMessageRequest();
    }

    public SqsClient buildSqsClient() {
        return SqsClient.builder()
                .region(awsRegion)
                .endpointOverride(URI.create(sqsUrl))
                .build();
    }

    public ReceiveMessageRequest buildReceiveMessageRequest() {
        return ReceiveMessageRequest.builder()
                .queueUrl(queueUrl)
                .waitTimeSeconds(1)
                .maxNumberOfMessages(5)
                .build();
    }

    public DeleteMessageRequest buildDeleteMessageRequest(Message message) {
        return DeleteMessageRequest.builder()
                .queueUrl(queueUrl)
                .receiptHandle(message.receiptHandle())
                .build();
    }

    public void consume() {
        print("Starting to consume messages...");

        while (true) {
            sqsClient.receiveMessage(receiveMessageRequest)
                    .messages()
                    .forEach(this::consumeMessage);
        }
    }

    public DeleteMessageRequest consumeMessage(Message message) {
        DeleteMessageRequest deleteMessageRequest = buildDeleteMessageRequest(message);

        printMessageBody(message);
        deleteMessage(deleteMessageRequest);

        return deleteMessageRequest;
    }

    public void printMessageBody(Message message) {
        print(message.body());
    }

    public void print(String text) {
        System.out.println(text);
    }

    public void deleteMessage(DeleteMessageRequest deleteMessageRequest) {
        sqsClient.deleteMessage(deleteMessageRequest);
    }

    public void setSqsClient(SqsClient sqsClient) {
        this.sqsClient = sqsClient;
    }

    public SqsClient getSqsClient() {
        return sqsClient;
    }
}
