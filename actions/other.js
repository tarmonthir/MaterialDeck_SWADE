import { Helpers } from "../helpers.js";

const localize = Helpers.localize;

function getDocs(path, action="otherActions") {
    return Helpers.getDocumentationUrl(path, action);
}

export const otherAction = {

    id: 'other',

    buttonActions: function(settings) {
        let actions = { update: [], keyDown: [], keyUp: [] };

        if (settings.function === 'rollType') {
            actions.update.push({
                run: this.onUpdateRollType,
                on: ['mdUpdateRollType']
            })
            actions.keyDown.push({
                run: this.onKeypressRollType
            }) 
        }
        return actions;
    },

    onUpdateRollType: function(data) {
        const mode = data.settings.rollType.mode;

        return {
            text: data.settings.display.modeName ? Helpers.getRollTypes().find(a => a.value === mode)?.label : "",
            icon: data.settings.display.icon ? Helpers.getRollTypeIcon(mode) : "",
            options: {
                border: true,
                borderColor: Helpers.rollType.get() === mode ? data.settings.colors.rollModeOn : data.settings.colors.rollModeOff,
            }
        };
    },

    onKeypressRollType: function(data) {
        Helpers.rollType.set(data.settings.rollType.mode, data.settings.rollType.reset);
    },

    settingsConfig: function() {
        return [
            {
                id: "function",
                link: "",
                appendOptions: [
                    { value: 'rollType', label: localize('SetDefaultRollType') }
                ]
            },{
                id: `rollType-wrapper`,
                type: "wrapper",
                indent: true,
                before: "pause.mode",
                visibility: { showOn: [{ function: "rollType" }]},
                settings:[
                    {
                        id: "rollType.mode",
                        label: localize('Type', 'ALL'),
                        link: "",
                        type: "select",
                        options: [
                            ...Helpers.getRollTypes()
                        ],
                    },{
                        id: "rollType.reset",
                        label: localize('SetAfterUseTo'),
                        link: "",
                        type: "select",
                        indent: true,
                        sync: "rollType.pageWide",
                        options: [
                            { value: 'none', label: localize('DoNotChange') },
                            ...Helpers.getRollTypes()
                        ]
                    },{
                        label: '',
                        id: "rollType.pageWide",
                        type: "checkbox",
                        default: true,
                        visibility: false
                    }
                ]
            },{
                id: "display-table",
                prependColumnVisibility: [
                    { 
                        showOn: [ 
                            { function: "rollType" }
                        ]
                    }
                ],
                prependColumns: [
                    {
                        label: localize("Name", "ALL"),
                    }
                ],
                prependRows: [
                    [
                        {
                            id: "display.modeName",
                            type: "checkbox",
                            default: true
                        }
                    ]
                ]
            },{
                id: "colors-table",
                prependColumnVisibility: [
                    { 
                        showOn: [ 
                            { function: "rollType" }
                        ]
                    },{ 
                        showOn: [ 
                            { function: "rollType" }
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
                            id: "colors.rollModeOn",
                            type: "color",
                            default: "#FFFF00"
                        },{
                            id: "colors.rollModeOff",
                            type: "color",
                            default: "#000000"
                        }
                    ]
                ]
            }
        ]
    }
}