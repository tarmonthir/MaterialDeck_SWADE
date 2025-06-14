import { Helpers } from "../../helpers.js";

const localize = Helpers.localize;

function getDocs(path, action="token") {
    return Helpers.getDocumentationUrl(path, action);
}

let featureOffset = 0;

export const featureMode = {

    updateAll: function() {
        for (let device of game.materialDeck.streamDeck.deviceManager.devices) {
            for (let button of device.buttons.buttons) {
                if (game.materialDeck.Helpers.getButtonAction(button) !== 'token') continue;
                if (game.materialDeck.Helpers.getButtonSettings(button).mode !== 'features') continue;
                button.update('md-swade.updateAllTokenFeatures')
            }
        }
    },

    getActions: function(settings) {
        let actions = { update: [], keyDown: [], keyUp: [] };
        
        const featureSettings = settings.featureMode;

        if (featureSettings.mode === 'offset') {
            actions.update.push({
                run: this.onOffsetUpdate
            });
            actions.keyDown.push({
                run: this.onOffsetKeydown
            })
        }

        else if (featureSettings.mode === 'setSyncFilter') {
            actions.update.push({
                run: this.onSetSyncFilterUpdate,
                on: ['md-token-PageSettingChanged']
            });
            actions.keyDown.push({
                run: this.onSetSyncFilterKeydown
            })
        }

        else {
            actions.update.push({
                run: this.onFeatureUpdate,
                on: ['updateItem', 'refreshToken']
            });
            actions.keyDown.push({
                run: this.onFeatureKeydown
            });
        }
        
        
        return actions;
    },

    onOffsetUpdate: function(data) {
        const settings = data.settings.featureMode.offset;
        let icon = '';
        if (data.settings.display.featureMode.icon) {
            if (settings.mode === 'set' || settings.value == 0) icon = 'fas fa-arrow-right-to-bracket';
            else if (settings.value > 0) icon = 'fas fa-arrow-right';
            else if (settings.value < 0) icon = 'fas fa-arrow-left';
        }
        
        return {
            icon,
            text: data.settings.display.featureMode.offset ? featureOffset : '',
            options: {
                border: true,
                borderColor: (settings.mode === 'set' && featureOffset == parseInt(settings.value)) ? data.settings.colors.system.on : data.settings.colors.system.off
            }
        }
    },

    onOffsetKeydown: function(data) {
        const settings = data.settings.featureMode.offset;
        if (settings.mode === 'set') featureOffset = parseInt(settings.value);
        else if (settings.mode === 'increment') featureOffset += parseInt(settings.value);

        featureMode.updateAll();
    },

    onSetSyncFilterUpdate: function(data) {
        const mode = data.settings.featureMode.setSync.mode;
        const displaySettings = data.settings.display.featureMode.setSync;

        let icon = '';
        if (displaySettings.icon) {
            if (mode === 'any') icon = 'fas fa-suitcase';
            else if (mode === 'ability') icon = 'fas fa-scroll-old';
            else if (mode === 'action') icon = 'fas fa-gears';
            else if (mode === 'ancestry') icon = 'fas fa-tree-deciduous';
            else if (mode === 'edge') icon = 'fas fa-medal';
            else if (mode === 'hindrance') icon = 'fas fa-thumbs-down';
			else if (mode === 'power') icon = 'fas fa-sparkles';
			else if (mode === 'skill') icon = 'fas fa-book';
        }
        
        let text = displaySettings.name ? getFeatureTypes().find(t => t.value === mode)?.label : '';
        const thisSelected = game.materialDeck.Helpers.isSynced(data.settings.featureMode.setSync, 'featureMode.syncFilter', 'featureMode.',  'token');

        return {
            text,
            icon,
            options: {
                border: true,
                borderColor: thisSelected ? data.settings.colors.system.on : data.settings.colors.system.off,
                dim: true
            }
        }
        
    },

    onSetSyncFilterKeydown: function(data) {
        const settings = data.settings.featureMode.setSync;

        let syncedSettings = [
            { key: 'featureMode.mode', value: settings.mode },
            { key: 'featureMode.selection.filter.featureType.power', value: settings.selection.filter.featureType.power },
            { key: 'featureMode.selection.filter.featureType.skill', value: settings.selection.filter.featureType.skill }
        ]

        data.button.sendData({
            type: 'setPageSync',
            payload: {
                context: data.button.context,
                device: data.button.device.id,
                action: 'token',
                sync: 'featureMode.syncFilter',
                settings: syncedSettings
            }
        })
    },

    onFeatureUpdate: function(data) {
        if (!data.actor) return;
        const feature = getFeature(data.actor, data.settings.featureMode);
       
        if (data.hooks === 'updateItem' && data.args[0].id !== feature.id) return 'doNothing';
        if (data.hooks === 'refreshToken' && data.args[0].id !== data.token?.id) return 'doNothing';

        if (!feature) return;

        const displaySettings = data.settings.display.featureMode;

        return {
            text: displaySettings.name ? feature.name : '', 
            icon: displaySettings.icon ? feature.img : '', 
            options: {
				dim: displaySettings.dim
            }
        };
    },

    onFeatureKeydown: function(data) {
        if (!data.actor) return;
        const feature = getFeature(data.actor, data.settings.featureMode);

        const rollType = Helpers.rollType.get(true);
    
        Helpers.useItem(feature, 
            {
                rollType, 
                showDialog:false
            }
        );
    },

    getSelectionSettings(type='', sync='featureMode.syncFilter') {
        let modeOptions = [];
        if (type === '') 
            modeOptions = [ 
                { label: localize('Feature'), children: [
                    { value: 'any', label: localize('Any', 'MD') },
                    ...getFeatureTypes()
                ]},
                { value: 'setSyncFilter', label: localize('SetTypeAndFilterSync') },
                { value: 'offset', label: localize('Offset', 'MD') }
            ]
        else modeOptions = [
            { value: 'any', label: localize('Any', 'MD') },
            ...getFeatureTypes()
        ]

        return [{
            label: localize('FeatureType'),
            id: `featureMode${type}.mode`,
            type: "select",
            default: "any",
            link: getDocs('#features-mode'),
            sync,
            options: modeOptions
        },{
            label: localize("FeatureTypeFilter"),
            id: `featureMode${type}-filter-table`,
            type: "table",
            visibility: { 
                showOn: [ 
                    { [`featureMode${type}.mode`]: "any" },
                    { [`featureMode${type}.mode`]: "feat" },
                    { [`featureMode.mode`]: type === "" ? "" : "setSyncFilter" } 
                ] 
            },
            columns: 
            [
                { label: localize('TYPES.Item.power', 'ALL') },
                { label: localize('TYPES.Item.skill', 'ALL') }
            ],
            rows: 
            [
                [
                    { 
                        id: `featureMode${type}.selection.filter.featureType.power`,
                        type: "checkbox",
                        sync,
                        default: true
                    },{ 
                        id: `featureMode${type}.selection.filter.featureType.skill`,
                        type: "checkbox",
                        sync,
                        default: true
                    }
                ]
            ]
        }]
    },

    getSettings: function() {
        return [
            ...featureMode.getSelectionSettings(),
            {
                id: `featureMode-feature-wrapper`,
                type: "wrapper",
                visibility: { 
                    hideOn: [ 
                        { [`featureMode.mode`]: "offset" },
                        { [`featureMode.mode`]: "setSyncFilter" } 
                    ] 
                },
                settings:[
                    {
                        label: localize('SyncTypeAndFilter'),
                        id: 'featureMode.syncFilter',
                        type: 'checkbox',
                        link: getDocs('#synced-settings'),
                        indent: true,
                    },{
                        label: localize('Selection', 'MD'),
                        id: "featureMode.selection.mode",
                        type: "select",
                        default: "nr",
                        options: [
                            {value:'nr', label: localize('SelectByNr', 'MD')},
                            {value:'nameId', label: localize('SelectByName/Id', 'MD')}
                        ]
                    },{
                        label: localize("Order"),
                        id: "featureMode.selection.order",
                        type: "select",
                        indent: true,
                        options: [
                            {value:'order', label: localize('CharacterSheet')},
                            {value:'name', label: localize('Alphabetically')}
                        ],
                        visibility: { showOn: [ { ["featureMode.selection.mode"]: "nr" } ] }
                    },{
                        label: localize("Nr", "MD"),
                        id: "featureMode.selection.nr",
                        type: "number",
                        default: "1",
                        indent: true,
                        visibility: { showOn: [ { ["featureMode.selection.mode"]: "nr" } ] }
                    },{
                        label: localize("Name/Id", "MD"),
                        id: "featureMode.selection.nameId",
                        type: "textbox",
                        indent: true,
                        visibility: { showOn: [ { ["featureMode.selection.mode"]: "nameId" } ] }
                    },{
                        type: "line-right"
                    }
                ]
            },{
                id: `featureMode-offset-wrapper`,
                type: "wrapper",
                visibility: { showOn: [ { [`featureMode.mode`]: "offset" } ] },
                settings:
                [
                    {
                        label: localize("Offset", "MD"),
                        id: "featureMode.offset.mode",
                        type: "select",
                        link: getDocs('#offset'),
                        options: [
                            { value: "set", label: localize("SetToValue", "MD") },
                            { value: "increment", label: localize("IncreaseDecrease", "MD") }
                        ]
                    },{
                        label: localize("Value", "SWADE"),
                        id: "featureMode.offset.value",
                        type: "number",
                        step: "1",
                        default: "0",
                        indent: true
                    },{
                        type: "line-right"
                    }
                ]
            },{
                id: `featureMode-setSync-wrapper`,
                type: "wrapper",
                indent: "true",
                visibility: { showOn: [ { [`featureMode.mode`]: "setSyncFilter" } ] },
                settings: [
                    ...featureMode.getSelectionSettings('.setSync', undefined),
                    {
                        label: localize("Display", "MD"),
                        id: "featureMode-setSync-display-table",
                        type: "table",
                        columns: 
                        [
                            { label: localize("Icon", "MD") },
                            { label: localize("Name", "ALL") }
                        ],
                        rows: 
                        [
                            [
                                {
                                    id: "display.featureMode.setSync.icon",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.featureMode.setSync.name",
                                    type: "checkbox",
                                    default: true
                                }
                            ]
                        ]
                    }
                ]
            },{
                label: localize("Display", "MD"),
                id: "featureMode-display-table",
                type: "table",
                visibility: { hideOn: [{ ['featureMode.mode']: "setSyncFilter" }] },
                columnVisibility: [
                    true,
                    { hideOn: [{ mode: "features", ['featureMode.mode']: "offset" }] },
                    { hideOn: [{ mode: "features", ['featureMode.mode']: "offset" }] },
                    { showOn: [{ mode: "features", ['featureMode.mode']: "offset" }] }
                ],
                columns: 
                [
                    { label: localize("Icon", "MD") },
                    { label: localize("Name", "ALL") },
                    { label: localize("Dim") },
                    { label: localize("Offset", "MD") }
                ],
                rows: 
                [
                    [
                        {
                            id: "display.featureMode.icon",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.featureMode.name",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.featureMode.dim",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.featureMode.offset",
                            type: "checkbox",
                            default: true
                        }
                    ]
                ]
            }
        ]
    }
}

function getFeatureTypes() {
    return [
        { value: "ability", label: localize('TYPES.Item.ability', 'ALL') },
        { value: "action", label: localize('TYPES.Item.action', 'ALL') },
        { value: "ancestry", label: localize('TYPES.Item.ancestry', 'ALL') },
        { value: "edge", label: localize('TYPES.Item.edge', 'ALL') },
        { value: "hindrance", label: localize('TYPES.Item.hindrance', 'ALL') },
		{ value: "power", label: localize('TYPES.Item.power', 'ALL') },
		{ value: "skill", label: localize('TYPES.Item.skill', 'ALL') }
    ]
}

function getFeature(actor, settings) {
    let featuresObj = {};
    const featureTypes = getFeatureTypes();

    const selectionType = settings.mode;
    const featureFilter = settings.selection.filter.featureType;

    //Add features
    for (let featureType of featureTypes) {
        const feat = featureType.value;
        
        let items = actor.itemTypes[feat];
        featuresObj[feat] = {
            items: []
        }
        if (selectionType !== 'any' && selectionType !== feat) continue;
        
        for (let item of items) {
			let filterable = (feat === 'skill' || feat === 'power');
			
            if (!featureFilter[feat] && filterable) continue;
            featuresObj[feat].items.push(item);
        }
    }

    let features = [];
    //Create array
    for (let featureType of featureTypes) {
        const feat = featureType.value;

        let items = featuresObj[feat]?.items || [];
        if (settings.selection.order === 'order') items = Object.values(items).sort((a, b) => a.order - b.order);
        features.push(...items);
    }

    if (settings.selection.order === 'name') features = game.materialDeck.Helpers.sort(features, settings.selection.order);

    let feature;
    if (settings.selection.mode === 'nr') {
        let featureNr = parseInt(settings.selection.nr) - 1 + featureOffset;
        feature = features[featureNr];
    }
    else if (settings.selection.mode === 'nameId') {
        feature = features.find(i => i.id === settings.selection.nameId.split('.').pop());
        if (!feature) feature = features.find(i => i.name === settings.selection.nameId);
        if (!feature) feature = features.find(i => game.materialDeck.Helpers.stringIncludes(i.name, settings.selection.nameId));
    }

    return feature;
}