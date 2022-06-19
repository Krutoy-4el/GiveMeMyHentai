/**
 * @name GiveMeMyHentai
 * @shortName GMMH
 * @version 0.2.0
 * @description This is a plugin which allows you to bypass Discord's age restrictions.
 * 
 * @author K4
 */

class GiveMeMyHentai {
    constructor() {
        this.initialized = false;
    }

    // Meta
    getName() { return "GiveMeMyHentai"; }
    getShortName() { return "GMMH"; }
    getDescription() { return "This is a plugin which allows you to bypass Discord's age restrictions."; }
    getVersion() { return "0.2.0"; }
    getAuthor() { return "K4"; }

    start() {
        if (typeof ZeresPluginLibrary !== "undefined") this.initialize();
        else console.error(this.getName() + ": [FATAL]: No ZeresLib!");
    }
       
    stop() {
        //PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has stopped.");
    };

    //  Initialize
    initialize() {
        function callback(payload) {
            ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId').getChannel(payload.channelId).nsfw = false;
        };
        ZeresPluginLibrary.DiscordModules.Dispatcher.subscribe('CHANNEL_SELECT', callback);
        console.log(this.getName() + " has started.");
        this.initialized = true;
    }
}