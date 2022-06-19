/**
 * @name GiveMeMyHentai
 * @shortName GMMH
 * @version 0.3.0
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
    getVersion() { return "0.3.0"; }
    getAuthor() { return "K4"; }

    start() {
        if (typeof ZeresPluginLibrary !== "undefined") this.initialize();
        else {
            BdApi.showConfirmationModal(
                "ZeresPluginLibrary is missing",
                [
                    this.getName() + " needs it to operate.",
                    "Do you want to download it?"
                ],
                {onConfirm: () => this.download_zeres_library()}
            );
        }
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

    async download_zeres_library() {
        let fs = require("fs");
        let path = require("path");
        let req = await fetch("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
        let data = await req.text();
        fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), data);
        setTimeout(() => this.start(), 1000);
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