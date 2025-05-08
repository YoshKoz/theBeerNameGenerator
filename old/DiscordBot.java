import discord4j.core.DiscordClient;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.message.MessageCreateEvent;
import discord4j.core.event.domain.channel.PrivateChannelCreateEvent;
import discord4j.core.object.entity.channel.PrivateChannel;

public class DiscordBot {

    public static void main(String[] args) {
        // Je Discord-bot token
        String token = "JouwBotTokenHier";

        // Maak een Discord-client
        DiscordClient client = DiscordClient.builder(token).build();

        // Log in en start de bot
        GatewayDiscordClient gateway = client.login().block();

        // Luister naar het maken van privékanalen (DM's)
        gateway.on(PrivateChannelCreateEvent.class)
                .subscribe(privateChannelCreateEvent -> {
                    PrivateChannel privateChannel = privateChannelCreateEvent.getChannel();
                    System.out.println("Ontvangen privébericht van gebruiker: " + privateChannel.getRecipientId());
                });

        // Luister naar berichtgebeurtenissen in privékanalen
        gateway.on(MessageCreateEvent.class)
                .subscribe(event -> {
                    event.getMessage().getChannel().ofType(PrivateChannel.class)
                            .ifPresent(privateChannel -> {
                                // Weergeef het bericht in de terminal
                                System.out.println("Ontvangen privébericht: " + event.getMessage().getContent());
                            });
                });

        // Blokkeer de thread totdat de bot stopt
        gateway.onDisconnect().block();
    }
}


//key: MTIwMjU3MjMxNjA5NDIzNDY4Ng.GK1D1z.5L2wS4Jj4wlyXXs0yogLBzo5yhCDR65A9qIr44