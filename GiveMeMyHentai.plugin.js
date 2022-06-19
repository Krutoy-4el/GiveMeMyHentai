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
        this.last_channel = null;
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
        BdApi.showToast(this.getName() + " " + this.getVersion() + " has stopped.");
        if (this.initialized) {
            if (this.last_channel) {
                this.last_channel.nsfw = true;
            }
            ZeresPluginLibrary.DiscordModules.Dispatcher.unsubscribe('CHANNEL_SELECT', this._callback);
        }
    }

    initialize() {
        this._callback = (p) => this.switch_callback(p);
        ZeresPluginLibrary.DiscordModules.Dispatcher.subscribe('CHANNEL_SELECT', this._callback);
        BdApi.showToast(this.getName() + " " + this.getVersion() + " has started.");
        this.initialized = true;
    }

    switch_callback(payload) {
        if (this.last_channel) {
            this.last_channel.nsfw = true;
            this.last_channel = null;
        }
        if (!payload.channelId) return;
        let channel = ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId').getChannel(payload.channelId);
        if (channel.nsfw) {
            channel.nsfw = false;
            this.last_channel = channel;
        }
    }
}