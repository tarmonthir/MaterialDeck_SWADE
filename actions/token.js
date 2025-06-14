import { Helpers } from "../helpers.js";
import { tokenMode } from "./tokenModes/tokenMode.js";
import { inventoryMode } from "./tokenModes/inventoryMode.js";
import { featureMode } from "./tokenModes/featureMode.js";
import { effectMode } from "./tokenModes/effectMode.js";

const localize = Helpers.localize;

export const tokenAction = {

    id: 'token',

    settingsConfig: function() {
        return [
			...tokenMode.getSettings(),
			{
				id: "mode",
				appendOptions: [
					{ value: "inventory", label: localize("Inventory") },
                    { value: "features", label: localize("Features") },
                    { value: "effects", label: localize("Effects", "SWADE") }
				]
			},{
                id: "inventory-wrapper",
                type: "wrapper",
                after: "mode",
                visibility: { showOn: [ { mode: "inventory" } ] },
                indent: 1,
                settings: inventoryMode.getSettings()
            },{
                id: "features-wrapper",
                type: "wrapper",
                after: "mode",
                visibility: { showOn: [ { mode: "features" } ] },
                indent: 1,
                settings: featureMode.getSettings()
            },{
                id: "effects-wrapper",
                type: "wrapper",
                after: "mode",
                visibility: { showOn: [ { mode: "effects" } ] },
                indent: 1,
                settings: effectMode.getSettings()
            },
			{
                id: "colors-table",
                prependColumnVisibility: [
                    { 
                        showOn: [ 
                            { mode: "token", [`tokenMode.keyUp.mode`]: "status" },
                            { mode: "token", [`tokenMode.hold.mode`]: "status" },
                            { mode: "inventory", ['inventoryMode.mode']: "offset", [`inventoryMode.offset.mode`]: "set" },
                            { mode: "inventory", [`inventoryMode.keyUp.mode`]: "equip" },
                            { mode: "inventory", ['inventoryMode.mode']: "setSyncFilter" },
                            { mode: "features", ['featureMode.mode']: "offset", [`featureMode.offset.mode`]: "set" },
                            { mode: "features", ['featureMode.mode']: "setSyncFilter" },
							{ mode: "effects" }
                        ]
                    },{ 
                        showOn: [ 
                            { mode: "token", [`tokenMode.keyUp.mode`]: "status" },
                            { mode: "token", [`tokenMode.hold.mode`]: "status" },
                            { mode: "inventory", ['inventoryMode.mode']: "offset", [`inventoryMode.offset.mode`]: "set" },
                            { mode: "inventory", [`inventoryMode.keyUp.mode`]: "equip" },
                            { mode: "inventory", ['inventoryMode.mode']: "setSyncFilter" },
                            { mode: "features", ['featureMode.mode']: "offset", [`featureMode.offset.mode`]: "set" },
                            { mode: "features", ['featureMode.mode']: "setSyncFilter" },
							{ mode: "effects" }
                        ]
                    }
                ],
                prependColumns: [
                    {
                        label: localize("OnColor", "MD"),
                    },{
                        label: localize("OffColor", "MD"),
                    }
                ],
                prependRows: [
                    [
                        {
                            id: "colors.system.on",
                            type: "color",
                            default: "#FFFF00"
                        },{
                            id: "colors.system.off",
                            type: "color",
                            default: "#000000"
                        }
                    ]
                ]
            }
		]
	},

    buttonActions: function(settings) {
        if (settings.mode === 'token') return tokenMode.getActions(settings);
        else if (settings.mode === 'inventory') return inventoryMode.getActions(settings);
        else if (settings.mode === 'features') return featureMode.getActions(settings);
        else if (settings.mode === 'effects') return effectMode.getActions(settings);
        return { update: [], keyDown: [], keyUp: [], hold: [] };
    }

}