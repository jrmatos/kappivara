package com.kappivara.blackwidow;

import com.kappivara.blackwidow.consumers.SqsConsumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;

import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BlackwidowApplicationTests {
	private SqsConsumer sqsConsumer;
	private Message message;

	@BeforeEach
	void beforeEach() {
		sqsConsumer = spy(new SqsConsumer(
				"http://sqs_url",
				"http://sqs_url/queue",
				Region.SA_EAST_1));

		message = Message.builder().body("Hello World").build();
	}

	@Test
	@DisplayName("Should consume message")
	void shouldConsumeMessage() {
		// given
		SqsConsumer sqsConsumerSpy = spy(sqsConsumer);
		sqsConsumerSpy.setSqsClient(mock(SqsClient.class));

		// when
		DeleteMessageRequest deleteMessageRequest = sqsConsumerSpy.consumeMessage(message);

		// then
		verify(sqsConsumerSpy).print("Hello World");
		verify(sqsConsumerSpy.getSqsClient()).deleteMessage(deleteMessageRequest);
	}

}
