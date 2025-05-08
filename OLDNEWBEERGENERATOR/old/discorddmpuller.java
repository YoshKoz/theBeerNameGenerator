import discord4j.core.DiscordClient;
import discord4j.core.DiscordClientBuilder;
import discord4j.core.event.domain.message.MessageCreateEvent;
import discord4j.core.object.entity.Message;
import discord4j.core.object.entity.User;
import discord4j.core.object.entity.channel.PrivateChannel;
import reactor.core.publisher.Flux;

public class DiscordDMPuller {
    public static void main(String[] args) {
        String token = "b5de017651fa0925622eedbd50e354b33357e43080785b41d10f6e871cf30500";

        DiscordClient client = new DiscordClientBuilder(token).build();

        client.getEventDispatcher().on(MessageCreateEvent.class)
                .subscribe(event -> {
                    String content = event.getMessage().getContent();
                    System.out.println("Received message: " + content);

                    // Check if the message is a command to pull DM messages (customize the command as needed)
                    if (content.equalsIgnoreCase("!pulldm")) {
                        User user = event.getMessage().getAuthor().orElse(null);
                        if (user != null) {
                            pullDirectMessages(user);
                        }
                    }
                });

        client.login().block();
    }

    private static void pullDirectMessages(User user) {
        user.getPrivateChannel()
                .flatMapMany(PrivateChannel::getMessages)
                .subscribe(message -> {
                    // Process or print each message as needed
                    System.out.println("DM Message: " + message.getContent());
                });
    }
}


//b5de017651fa0925622eedbd50e354b33357e43080785b41d10f6e871cf30500 DE TOKEN VOOR DISCORD