import { Helpers } from "../../helpers.js";

const localize = Helpers.localize;

function getDocs(path, action="token") {
    return Helpers.getDocumentationUrl(path, action);
}

let effectOffset = 0;

export const effectMode = {

    updateAll: function() {
        for (let device of game.materialDeck.streamDeck.deviceManager.devices) {
            for (let button of device.buttons.buttons) {
                if (game.materialDeck.Helpers.getButtonAction(button) !== 'token') continue;
                if (game.materialDeck.Helpers.getButtonSettings(button).mode !== 'effects') continue;
                button.update('md-swade.updateAllTokenEffects')
            }
        }
    },

    getActions: function(settings) {
        let actions = { update: [], keyDown: [], keyUp: [] };
        
        const effectSettings = settings.effectMode;

        if (effectSettings.mode === 'offset') {
            actions.update.push({
                run: this.onOffsetUpdate
            });
            actions.keyDown.push({
                run: this.onOffsetKeydown
            })
        }

        else if (effectSettings.mode === 'setSyncFilter') {
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
                run: this.onEffectUpdate,
                on: ['updateItem', 'refreshToken']
            });
            actions.keyDown.push({
                run: this.onEffectKeydown
            });
        }
        
        
        return actions;
    },

    onOffsetUpdate: function(data) {
        const settings = data.settings.effectMode.offset;
        let icon = '';
        if (data.settings.display.effectMode.icon) {
            if (settings.mode === 'set' || settings.value == 0) icon = 'fas fa-arrow-right-to-bracket';
            else if (settings.value > 0) icon = 'fas fa-arrow-right';
            else if (settings.value < 0) icon = 'fas fa-arrow-left';
        }
        
        return {
            icon,
            text: data.settings.display.effectMode.offset ? effectOffset : '',
            options: {
                border: true,
                borderColor: (settings.mode === 'set' && effectOffset == parseInt(settings.value)) ? data.settings.colors.system.on : data.settings.colors.system.off
            }
        }
    },

    onOffsetKeydown: function(data) {
        const settings = data.settings.effectMode.offset;
        if (settings.mode === 'set') effectOffset = parseInt(settings.value);
        else if (settings.mode === 'increment') effectOffset += parseInt(settings.value);

        effectMode.updateAll();
    },

    onSetSyncFilterUpdate: function(data) {
        const mode = data.settings.effectMode.setSync.mode;
        const displaySettings = data.settings.display.effectMode.setSync;

        let icon = '';
        if (displaySettings.icon) {
            if (mode === 'any') icon = 'fas fa-suitcase';
            else if (mode === 'base') icon = 'fas fa-sparkles';
            else if (mode === 'activeEffect') icon = 'fas fa-gears';
            else if (mode === 'modifier') icon = 'fas fa-plus-minus';
        }
        
        let text = displaySettings.name ? getEffectTypes().find(t => t.value === mode)?.label : '';
        const thisSelected = game.materialDeck.Helpers.isSynced(data.settings.effectMode.setSync, 'effectMode.syncFilter', 'effectMode.',  'token');

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
        const settings = data.settings.effectMode.setSync;

        let syncedSettings = [
            { key: 'effectMode.mode', value: settings.mode },
            { key: 'effectMode.selection.filter.effectType.temporary', value: settings.selection.filter.effectType.temporary },
            { key: 'effectMode.selection.filter.effectType.permanent', value: settings.selection.filter.effectType.permanent }
        ]

        data.button.sendData({
            type: 'setPageSync',
            payload: {
                context: data.button.context,
                device: data.button.device.id,
                action: 'token',
                sync: 'effectMode.syncFilter',
                settings: syncedSettings
            }
        })
    },

    onEffectUpdate: function(data) {
        if (!data.actor) return;
        const effect = getEffect(data.actor, data.settings.effectMode);
       
        if (data.hooks === 'updateItem' && data.args[0].id !== effect.id) return 'doNothing';
        if (data.hooks === 'refreshToken' && data.args[0].id !== data.token?.id) return 'doNothing';

        if (!effect) return;

        const displaySettings = data.settings.display.effectMode;
		let options = { dim: displaySettings.dim, border: true }
		if (effect.active) { options.borderColor = data.settings.colors.system.on; }
		else { options.borderColor = data.settings.colors.system.off; }

        return {
            text: displaySettings.name ? effect.name : '', 
            icon: displaySettings.icon ? effect.img : '', 
            options: options
        };
    },

    onEffectKeydown: function(data) {
        if (!data.actor) return;
        const effect = getEffect(data.actor, data.settings.effectMode);
		if (effect) { effect.update({ disabled: !effect?.disabled }); }
    },

    getSelectionSettings(type='', sync='effectMode.syncFilter') {
        let modeOptions = [];
        if (type === '') 
            modeOptions = [ 
                { label: localize('Effect'), children: getEffectTypes()},
                { value: 'setSyncFilter', label: localize('SetTypeAndFilterSync') },
                { value: 'offset', label: localize('Offset', 'MD') }
            ]
        else modeOptions = getEffectTypes()

        return [{
            label: localize('EffectType'),
            id: `effectMode${type}.mode`,
            type: "select",
            default: "any",
            link: getDocs('#effects-mode'),
            sync,
            options: modeOptions
        },{
            label: localize("EffectTypeFilter"),
            id: `effectMode${type}-filter-table`,
            type: "table",
            visibility: { 
                hideOn: [ 
                    { [`effectMode.mode`]: "offset" },
					{ [`effectMode.mode`]: type === "" ? "setSyncFilter" : "" }
                ] 
            },
            columns: 
            [
                { label: localize('EffectsTemporary', 'SWADE') },
                { label: localize('EffectsPermanent', 'SWADE') },
				{ label: localize('Status', 'SWADE') }
            ],
            rows: 
            [
                [
                    { 
                        id: `effectMode${type}.selection.filter.effectType.temporary`,
                        type: "checkbox",
                        sync,
                        default: true
                    },{ 
                        id: `effectMode${type}.selection.filter.effectType.permanent`,
                        type: "checkbox",
                        sync,
                        default: true
                    }
					,{ 
                        id: `effectMode${type}.selection.filter.effectType.status`,
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
            ...effectMode.getSelectionSettings(),
            {
                id: `effectMode-effect-wrapper`,
                type: "wrapper",
                visibility: { 
                    hideOn: [ 
                        { [`effectMode.mode`]: "offset" },
                        { [`effectMode.mode`]: "setSyncFilter" } 
                    ] 
                },
                settings:[
                    {
                        label: localize('SyncTypeAndFilter'),
                        id: 'effectMode.syncFilter',
                        type: 'checkbox',
                        link: getDocs('#synced-settings'),
                        indent: true,
                    },{
                        label: localize('Selection', 'MD'),
                        id: "effectMode.selection.mode",
                        type: "select",
                        default: "nr",
                        options: [
                            {value:'nr', label: localize('SelectByNr', 'MD')},
                            {value:'nameId', label: localize('SelectByName/Id', 'MD')}
                        ]
                    },{
                        label: localize("Order"),
                        id: "effectMode.selection.order",
                        type: "select",
                        indent: true,
                        options: [
                            {value:'order', label: localize('CharacterSheet')},
                            {value:'name', label: localize('Alphabetically')}
                        ],
                        visibility: { showOn: [ { ["effectMode.selection.mode"]: "nr" } ] }
                    },{
                        label: localize("Nr", "MD"),
                        id: "effectMode.selection.nr",
                        type: "number",
                        default: "1",
                        indent: true,
                        visibility: { showOn: [ { ["effectMode.selection.mode"]: "nr" } ] }
                    },{
                        label: localize("Name/Id", "MD"),
                        id: "effectMode.selection.nameId",
                        type: "textbox",
                        indent: true,
                        visibility: { showOn: [ { ["effectMode.selection.mode"]: "nameId" } ] }
                    },{
                        type: "line-right"
                    }
                ]
            },{
                id: `effectMode-offset-wrapper`,
                type: "wrapper",
                visibility: { showOn: [ { [`effectMode.mode`]: "offset" } ] },
                settings:
                [
                    {
                        label: localize("Offset", "MD"),
                        id: "effectMode.offset.mode",
                        type: "select",
                        link: getDocs('#offset'),
                        options: [
                            { value: "set", label: localize("SetToValue", "MD") },
                            { value: "increment", label: localize("IncreaseDecrease", "MD") }
                        ]
                    },{
                        label: localize("Value", "SWADE"),
                        id: "effectMode.offset.value",
                        type: "number",
                        step: "1",
                        default: "0",
                        indent: true
                    },{
                        type: "line-right"
                    }
                ]
            },{
                id: `effectMode-setSync-wrapper`,
                type: "wrapper",
                indent: "true",
                visibility: { showOn: [ { [`effectMode.mode`]: "setSyncFilter" } ] },
                settings: [
                    ...effectMode.getSelectionSettings('.setSync', undefined),
                    {
                        label: localize("Display", "MD"),
                        id: "effectMode-setSync-display-table",
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
                                    id: "display.effectMode.setSync.icon",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.effectMode.setSync.name",
                                    type: "checkbox",
                                    default: true
                                }
                            ]
                        ]
                    }
                ]
            },{
                label: localize("Display", "MD"),
                id: "effectMode-display-table",
                type: "table",
                visibility: { hideOn: [{ ['effectMode.mode']: "setSyncFilter" }] },
                columnVisibility: [
                    true,
                    { hideOn: [{ mode: "effects", ['effectMode.mode']: "offset" }] },
                    { hideOn: [{ mode: "effects", ['effectMode.mode']: "offset" }] },
                    { showOn: [{ mode: "effects", ['effectMode.mode']: "offset" }] }
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
                            id: "display.effectMode.icon",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.effectMode.name",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.effectMode.dim",
                            type: "checkbox",
                            default: true
                        },{
                            id: "display.effectMode.offset",
                            type: "checkbox",
                            default: true
                        }
                    ]
                ]
            }
        ]
    }
}

function getEffectTypes() {
    return [
        {value: 'any', label: Helpers.localize('Any', 'MD') },
        {value: 'base', label: Helpers.localize('TYPES.Base', 'ALL') },
        {value: 'activeEffect', label: Helpers.localize('ActiveEffect') },
        {value: 'modifier', label: Helpers.localize('TYPES.ActiveEffect.modifier', 'ALL') }
    ]
}

function getEffect(actor, settings) {
	let effects = [];
	
	//Filter effects
	const filter = settings.selection.filter.effectType;
	if (filter.temporary) effects.push(...actor.effects.filter(i => i.isTemporary));
    if (filter.permanent) effects.push(...actor.effects.filter(i => !i.isTemporary));
	if (!filter.status) { effects = effects.filter(i => !i.statusId); }

	if (settings.mode !== 'any') effects = effects.filter(i => i.type === settings.mode);
	effects = game.materialDeck.Helpers.sort(effects, settings.selection.order);
	
	if (!effects || effects.length === 0) return;
	
	let effect;
	if (settings.selection.mode === 'nr') {
        let effectNr = parseInt(settings.selection.nr) - 1 + effectOffset;
        effect = effects[effectNr];
    }
	else if (settings.selection.mode === 'nameId') {
        effect = effects.find(i => i.id === settings.selection.nameId.split('.').pop());
        if (!effect) effect = effects.find(i => i.name === settings.selection.nameId);
        if (!effect) effect = effects.find(i => game.materialDeck.Helpers.stringIncludes(i.name, settings.selection.nameId));
    }
	return effect;
}