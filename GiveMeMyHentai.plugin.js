//META{"name":"GiveMeMyHentai"}*//

class GiveMeMyHentai {
    // Constructor
    constructor() {
        this.initialized = false;
    }

    // Meta
    getName() { return "GiveMeMyHentai"; }
    getShortName() { return "GMMH"; }
    getDescription() { return "This is a plugin which allows you to bypass Discord's age restrictions."; }
    getVersion() { return "0.2.0"; }
    getAuthor() { return "K4"; }

    // Settings  Panel
    // getSettingsPanel() {
    //     return "<!--Enter Settings Panel Options, just standard HTML-->";
    // }
    
    // Load/Unload
    load() { }

    unload() { }

    // Events

    onMessage() {
        // Called when a message is received
    };
    
    onSwitch() {
        // Called when a server or channel is switched
    };

    observer(e) {
        // raw MutationObserver event for each mutation
    };
    
    // Start/Stop
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