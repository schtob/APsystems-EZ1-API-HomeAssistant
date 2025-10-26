import * as utils from "@iobroker/adapter-core";

class ApsystemsEz1M extends utils.Adapter {

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "apsystems-ez1-m",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is available via
        // this.config:
        this.log.info("config inverter_ip: " + this.config.inverter_ip);

        /*
        For every state in the system there has to be also an object of type state
        Here a simple example is given:
        */
        await this.setObjectNotExistsAsync("testVariable", {
            type: "state",
            common: {
                name: "testVariable",
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });

        // In order to determine whether a state has changed, you should create a subscription. The following line says that for all states
        // that match the parameter, we want to receive notifications with their values.
        this.subscribeStates("testVariable");

        this.log.info("apsystems-ez1-m adapter started");
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            this.log.info("cleaned everything up...");
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new ApsystemsEz1M(options);
} else {
    // otherwise start the instance directly
    (() => new ApsystemsEz1M())();
}