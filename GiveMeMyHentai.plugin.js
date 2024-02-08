/**
 * @name GiveMeMyHentai
 * @shortName GMMH
 * @version 0.4.1
 * @description This is a plugin which allows you to bypass age restrictions in NSFW channels.
 * 
 * @author Sóla Lusøt
 * @source https://github.com/solaluset/GiveMeMyHentai
 * @updateUrl https://raw.githubusercontent.com/solaluset/GiveMeMyHentai/master/GiveMeMyHentai.plugin.js
 */

class GiveMeMyHentai {
    MESSAGE_EVENTS = [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'CHANNEL_SELECT',
        'LOAD_MESSAGES_SUCCESS'
    ];

    constructor() {
        this.initialized = false;
        this.last_channel = null;
        this.listeners = [];
    }

    // Meta
    getName() { return "GiveMeMyHentai"; }
    getShortName() { return "GMMH"; }
    getDescription() { return "This is a plugin which allows you to bypass age restrictions in NSFW channels."; }
    getVersion() { return "0.4.2"; }
    getAuthor() { return "Sóla Lusøt"; }

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
            let disp = ZeresPluginLibrary.DiscordModules.Dispatcher;
            disp.unsubscribe('CHANNEL_SELECT', this._switch_callback);
            for (let i = 0; i < this.MESSAGE_EVENTS.length; i++) {
                disp.unsubscribe(this.MESSAGE_EVENTS[i], this._message_callback);
            }

            let pair;
            while (pair = this.listeners.pop()) {
                pair[0].removeEventListener('click', pair[1]);
            }
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
        this._switch_callback = (p) => this.switch_callback(p.channelId);
        this._message_callback = () => setTimeout(() => this.message_callback(), 1000);
        let disp = ZeresPluginLibrary.DiscordModules.Dispatcher;
        disp.subscribe('CHANNEL_SELECT', this._switch_callback);
        for (let i = 0; i < this.MESSAGE_EVENTS.length; i++) {
            disp.subscribe(this.MESSAGE_EVENTS[i], this._message_callback);
        }
        BdApi.showToast(this.getName() + " " + this.getVersion() + " has started.");
        this.initialized = true;
    }

    switch_callback(channel_id) {
        if (this.last_channel) {
            this.last_channel.nsfw = true;
            this.last_channel = null;
        }
        if (!channel_id) return;
        let channel = ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId').getChannel(channel_id);
        if (channel && channel.nsfw) {
            channel.nsfw = false;
            this.last_channel = channel;
        }
    }

    message_callback() {
        let elements = document.getElementsByTagName("a");
        for (let i = 0; i < elements.length; i++) {
            let link = elements[i];
            let match = link.href.match(/https?:\/\/discord(app)?.com\/channels\/\d+\/(?<id>\d+)/);
            if (match) {
                let callback = () => this.switch_callback(match.groups.id);
                let already_injected = false;
                for (let j = 0; j < this.listeners.length; j++) {
                    if (this.listeners[j][0] === link) {
                        already_injected = true;
                        break;
                    }
                }
                if (already_injected) continue;
                link.addEventListener('click', callback);
                this.listeners.push([link, callback]);
            }
        }
    }

    observer(changes) {
        if (!changes.removedNodes) return
        for (let i = 0; i < changes.removedNodes.length; i++) {
            for (let j = 0; j < this.listeners.length; j++) {
                if (changes.removedNodes[i].contains(this.listeners[j][0])) {
                    this.listeners.splice(j, 1);
                    j--;
                }
            }
        }
    }
}
