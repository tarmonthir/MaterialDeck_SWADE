import { Helpers } from "../../helpers.js";

const localize = Helpers.localize;

function getDocs(path, action="token") {
    return Helpers.getDocumentationUrl(path, action);
}

let inventoryOffset = 0;

export const inventoryMode = {

    updateAll: function() {
        for (let device of game.materialDeck.streamDeck.deviceManager.devices) {
            for (let button of device.buttons.buttons) {
                if (game.materialDeck.Helpers.getButtonAction(button) !== 'token') continue;
                if (game.materialDeck.Helpers.getButtonSettings(button).mode !== 'inventory') continue;
                button.update('md-swade.updateAllTokenInventory')
            }
        }
    },

    getActions: function(settings) {
        let actions = { update: [], keyDown: [], keyUp: [], hold: [] };
        const holdTime = game.materialDeck.holdTime;

        const inventorySettings = settings.inventoryMode;

        if (inventorySettings.mode === 'offset') {
            actions.update.push({
                run: this.onOffsetUpdate
            });
            actions.keyDown.push({
                run: this.onOffsetKeydown
            })
        }

        else if (inventorySettings.mode === 'setSyncFilter') {
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
                run: this.onInventoryUpdate,
                on: ['updateItem', 'refreshToken']
            });
            
            const onPress = inventorySettings.keyUp.mode;
            const onHold = inventorySettings.hold.mode;
            
            if (onPress === 'useItem') {
                actions.keyUp.push({
                    run: this.onKeypressUseItem,
                    stopOnHold: true
                });
            }
            if (onHold === 'useItem') {
                actions.hold.push({
                    run: this.onKeypressUseItem,
                    delay: holdTime
                });
            }

            if (onPress === 'equip') {
                actions.keyUp.push({
                    run: this.onKeypressEquip,
                    stopOnHold: true
                });
            }
            if (onHold === 'equip') {
                actions.hold.push({
                    run: this.onKeypressEquip,
                    delay: holdTime
                });
            }

            if (onPress === 'setQuantity') {
                actions.keyUp.push({
                    run: this.onKeypressSetQuantity,
                    stopOnHold: true
                });
            }
            if (onHold === 'setQuantity') {
                actions.hold.push({
                    run: this.onKeypressSetQuantity,
                    delay: holdTime
                });
            }

            if (onPress === 'setCharges') {
                actions.keyUp.push({
                    run: this.onKeypressSetCharges,
                    stopOnHold: true
                });
            }
            if (onHold === 'setCharges') {
                actions.hold.push({
                    run: this.onKeypressSetCharges,
                    delay: holdTime
                });
            }
        }

        
        return actions;
    },

    onOffsetUpdate: function(data) {
        const settings = data.settings.inventoryMode.offset;
        let icon = '';
        if (data.settings.display.inventoryMode.offsetIcon) {
            if (settings.mode === 'set' || settings.value == 0) icon = 'fas fa-arrow-right-to-bracket';
            else if (settings.value > 0) icon = 'fas fa-arrow-right';
            else if (settings.value < 0) icon = 'fas fa-arrow-left';
        }
        
        return {
            icon,
            text: data.settings.display.inventoryMode.offset ? inventoryOffset : '',
            options: {
                border: true,
                borderColor: (settings.mode === 'set' && inventoryOffset == parseInt(settings.value)) ? data.settings.colors.system.on : data.settings.colors.system.off
            }
        }
    },

    onOffsetKeydown: function(data) {
        const settings = data.settings.inventoryMode.offset;
        if (settings.mode === 'set') inventoryOffset = parseInt(settings.value);
        else if (settings.mode === 'increment') inventoryOffset += parseInt(settings.value);

        inventoryMode.updateAll();
    },

    onSetSyncFilterUpdate: function(data) {
        const mode = data.settings.inventoryMode.setSync.mode;
        const displaySettings = data.settings.display.inventoryMode.setSync;
        const filter = data.settings.inventoryMode.setSync.selection.filter;

        let icon = '';
        if (displaySettings.icon) {
            let iconSrc = '';
            if (mode === 'any') iconSrc = 'fas fa-suitcase';
            else if (mode === 'weapon') iconSrc = 'fas fa-sword';
            else if (mode === 'gear') iconSrc = 'fas fa-toolbox';
            else if (mode === 'consumable') iconSrc = 'fas fa-flask';
            else if (mode === 'armor') iconSrc = 'fas fa-helmet-battle';
            else if (mode === 'shield') iconSrc = 'fas fa-shield-halved';

            if (displaySettings.filter) {
                icon = [{icon: iconSrc, size: 0.8, spacing: {x:0, y:30}}]
                if (filter.equipped) icon.push({icon: 'fas fa-shield-check', size: 0.3, spacing: {x:-28, y:-15}})
                if (filter.carried) icon.push({icon: 'fas fa-backpack', size: 0.3, spacing: {x:0, y:-15}, color: '#454545'})
                if (filter.stored) icon.push({icon: 'fas fa-treasure-chest', size: 0.3, spacing: {x:28, y:-15}, color: '#454545'})
            }
            else {
                icon = iconSrc
            }
        }
        else if (displaySettings.filter) {
            icon = []
            if (filter.equipped) icon.push({icon: 'fas fa-shield-check', size: 0.4, spacing: {x:-45, y:50}})
            if (filter.carried) icon.push({icon: 'fas fa-backpack', size: 0.4, spacing: {x:0, y:50}, color: '#454545'})
            if (filter.stored) icon.push({icon: 'fas fa-treasure-chest', size: 0.4, spacing: {x:45, y:50}, color: '#454545'})
        }
        
        let text = displaySettings.name ? getItemTypes().find(t => t.value === mode)?.label : '';
        const thisSelected = game.materialDeck.Helpers.isSynced(data.settings.inventoryMode.setSync, 'inventoryMode.syncFilter', 'inventoryMode.',  'token');

        return {
            text,
            icon,
            options: {
                border: true,
                borderColor: thisSelected ? data.settings.colors.system.on : data.settings.colors.system.off
            }
        }
        
    },

    onSetSyncFilterKeydown: function(data) {
        const settings = data.settings.inventoryMode.setSync;

        let syncedSettings = [
            { key: 'inventoryMode.mode', value: settings.mode },
            { key: 'inventoryMode.selection.filter.equipped', value: settings.selection.filter.equipped },
            { key: 'inventoryMode.selection.filter.carried', value: settings.selection.filter.carried },
            { key: 'inventoryMode.selection.filter.stored', value: settings.selection.filter.stored },
        ]

        data.button.sendData({
            type: 'setPageSync',
            payload: {
                context: data.button.context,
                device: data.button.device.id,
                action: 'token',
                sync: 'inventoryMode.syncFilter',
                settings: syncedSettings
            }
        })
    },

    onInventoryUpdate: function(data) {
        if (!data.actor) return;
        const settings = data.settings.inventoryMode;
        const item = getItem(data.actor, settings);
        if (!item) return;

        if (data.hooks === 'updateItem' && data.args[0].id !== item.id) return 'doNothing';
        if (data.hooks === 'refreshToken' && data.args[0].id !== token.id) return 'doNothing';
        
        let text = "";
        let options = { dim: data.settings.display.inventoryMode.dim };
        let damage = '';

        const displaySettings = data.settings.display.inventoryMode;
        if (displaySettings.name) text = item.name;
		if (displaySettings.range) item.system.range ? text += "\n" + item.system.range : '' ;
		if (displaySettings.damage) {
			let damage = '';
			let terms = foundry.dice.Roll.parse(item.system.damage, item.actor?.getRollData() ?? {});
			for (const element of terms) {
				damage += element.expression;
			}
			text += "\n" + damage;
		}
        
        if (displaySettings.box === 'quantity') options.uses = { available: item.system.quantity, box: true }; 
        else if (displaySettings.box === 'charges') {
			options.uses = { available: item.system.charges?.value, maximum: item.system.charges?.max, box: true };
		}
        else if (displaySettings.box === 'damage') {
			let damage = '';
			let terms = foundry.dice.Roll.parse(item.system.damage, item.actor?.getRollData() ?? {});
			for (const element of terms) {
				damage += element.expression;
			}
			options.uses = { text: damage.replace(/\s+/g, ''), box: true };
		}

        if (settings.keyUp.mode === 'equip') {
            options.border = true;
            options.borderColor = item.system.equipStatus > 1 ? data.settings.colors.system.on : data.settings.colors.system.off
        }

        return {
            text, 
            icon: displaySettings.icon ? item.img : '', 
            options
        };
    },

    onKeypressUseItem: function(data) {
        if (!data.actor) return;
        const settings = data.settings.inventoryMode;
        const onPressSettings = settings[data.actionType];
        const item = getItem(data.actor, settings);
        if (!item) return;
        useItem(item, onPressSettings)
    },

    onKeypressEquip: function(data) {
        if (!data.actor) return;
        const settings = data.settings.inventoryMode;
        const mode = settings[data.actionType].equip.mode;
        const item = getItem(data.actor, settings);
        if (!item) return;
        
        if (mode === 'toggle') { 
			console.log("item.type: " + item.type);
			if (item.type === 'weapon') { item.system.equipStatus > 1 ? item.setEquipState(1) : item.setEquipState(4) } 
			else { item.system.equipStatus > 1 ? item.setEquipState(1) : item.setEquipState(3) }
		}
        else if (mode === 'equip') {
			if (item.type === 'weapon') { item.system.equipStatus > 1 ? item.setEquipState(1) : item.setEquipState(4) } 
			else { item.system.equipStatus > 1 ? item.setEquipState(1) : item.setEquipState(3) }
		}
        else if (mode === 'unequip') item.setEquipState(1);
    },

    onKeypressSetQuantity: function(data) {
        if (!data.actor) return;
        const settings = data.settings.inventoryMode;
		console.log(settings);
        const setQuantitySettings = settings[data.actionType].setQuantity;
		console.log(setQuantitySettings);
        const item = getItem(data.actor, settings);
        if (!item) return;
        
        let quantity;
        if (setQuantitySettings.mode === 'set') quantity = parseInt(setQuantitySettings.value);
        else if (setQuantitySettings.mode === 'increment') quantity = item.system.quantity + parseInt(setQuantitySettings.value);
        item.update({"system.quantity": quantity})
    },

    onKeypressSetCharges: function(data) {
        if (!data.actor) return;
        const settings = data.settings.inventoryMode;
		console.log(settings);
        const setChargeSettings = settings[data.actionType].setCharges;
        const item = getItem(data.actor, settings);
        if (!item) return;
        
        let charges = item.system.charges;
        if (!charges) return;

        if (setChargeSettings.mode === 'reset') {
            charges.value = charges.max;
        }
        else if (setChargeSettings.mode === 'set') {
            const val = parseInt(setChargeSettings.value);
            charges.value = val;
        }
        else if (setChargeSettings.mode === 'increment') {
            const val = charges.value + parseInt(setChargeSettings.value);
            charges.value = val;
        }
        item.update({"system.charges": charges})
    },

    getSelectionSettings(type='', sync='inventoryMode.syncFilter') {

        let modeOptions = [];
        if (type === '') 
            modeOptions = [ 
                { label: localize("DOCUMENT.Item", "ALL"), children: getItemTypes()},
                { value: 'setSyncFilter', label: localize('SetTypeAndFilterSync') },
                { value: 'offset', label: localize('Offset', 'MD') }
            ]
        else modeOptions = getItemTypes()

        return [{
            label: localize('ItemType', 'SWADE'),
            id: `inventoryMode${type}.mode`,
            type: "select",
            default: "any",
            link: getDocs('#inventory-mode'),
            sync,
            options: modeOptions
        },{
            label: localize("SelectionFilter"),
            id: `inventoryMode${type}-selectionFilter-table`,
            type: "table",
            visibility: { 
                hideOn: [ 
                    { [`inventoryMode.mode`]: "offset" },
                    { [`inventoryMode.mode`]: type === "" ? "setSyncFilter" : "" } 
                ] 
            },
            columns: 
            [
                { label: localize('ItemEquipStatus.Equipped', 'SWADE') }, 
                { label: localize('ItemEquipStatus.Carried', 'SWADE') },
				{ label: localize('ItemEquipStatus.Stored', 'SWADE') }
            ],
            rows: 
            [
                [
                    { 
                        id: `inventoryMode${type}.selection.filter.equipped`, // This should include weapons with Main Hand, Off Hand, and Two Hands statuses
                        type: "checkbox",
                        sync,
                        default: true
                    },{ 
                        id: `inventoryMode${type}.selection.filter.carried`,
                        type: "checkbox",
                        sync,
                        default: true
                    },{ 
                        id: `inventoryMode${type}.selection.filter.stored`,
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
            ...inventoryMode.getSelectionSettings(),
            {
                label: localize('SyncTypeAndFilter'),
                id: 'inventoryMode.syncFilter',
                type: 'checkbox',
                link: getDocs('#synced-settings'),
                indent: true,
                visibility: { 
                    hideOn: [ 
                        { [`inventoryMode.mode`]: "offset" },
                        { [`inventoryMode.mode`]: "setSyncFilter" } 
                    ] 
                },
            },{
                id: `inventoryMode-item-wrapper`,
                type: "wrapper",
                visibility: { 
                    hideOn: [ 
                        { [`inventoryMode.mode`]: "offset" },
                        { [`inventoryMode.mode`]: "setSyncFilter" } 
                    ] 
                },
                settings:
                [
                    {
                        label: localize('Selection', 'MD'),
                        id: "inventoryMode.selection.mode",
                        type: "select",
                        default: "nr",
                        options: [
                            {value:'nr', label: localize('SelectByNr', 'MD')},
                            {value:'nameId', label: localize('SelectByName/Id', 'MD')}
                        ]
                    },{
                        label: localize("Order"),
                        id: "inventoryMode.selection.order",
                        type: "select",
                        indent: true,
                        options: [
                            {value:'order', label: localize('CharacterSheet')},
                            {value:'name', label: localize('Alphabetically')}
                        ],
                        visibility: { showOn: [ { ["inventoryMode.selection.mode"]: "nr" } ] }
                    },{
                        label: localize("Nr", "MD"),
                        id: "inventoryMode.selection.nr",
                        type: "number",
                        default: "1",
                        indent: true,
                        visibility: { showOn: [ { ['inventoryMode.selection.mode']: "nr" } ] }
                    },{
                        label: localize("Name/Id", "MD"),
                        id: "inventoryMode.selection.nameId",
                        type: "textbox",
                        indent: true,
                        visibility: { showOn: [ { ['inventoryMode.selection.mode']: "nameId" } ] }
                    },{
                        type: "line-right"
                    },
                    ...getItemOnPressSettings(),{
                        type: "line-right"
                    },
                    ...getItemOnPressSettings('hold'),
                    {
                        type: "line-right"
                    },{
                        label: localize("Display", "MD"),
                        id: "inventoryMode-display-table",
                        type: "table",
                        columnVisibility: [
                            true,
                            true,
                            true
                        ],
                        columns: 
                        [
                            { label: localize("Icon", "MD") },
                            { label: localize("Name", "ALL") },
                            { label: localize("Box", "MD") }
                        ],
                        rows: 
                        [
                            [
                                {
                                    id: "display.inventoryMode.icon",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.inventoryMode.name",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.inventoryMode.box",
                                    type: "select",
                                    default: "none",
                                    options: [
                                        { value: 'none', label: localize('None', "ALL") },
                                        { value: 'quantity', label: localize('Quantity', 'SWADE') },
                                        { value: 'charges', label: localize('Charges', 'SWADE') },
                                        { value: 'damage', label: localize('Dmg', 'SWADE') }
                                    ]
                                }
                            ],[
                                { 
                                    type: "label", 
                                    label: localize('Dmg', 'SWADE'), 
                                    font: "bold"
                                },
                                { 
                                    type: "label", 
                                    label: localize("Range._name", "SWADE"),
                                    font: "bold"
                                },
								{ 
                                    type: "label", 
                                    label: localize("Dim"),
                                    font: "bold"
                                }
                            ],[
                                {
                                    id: "display.inventoryMode.damage",
                                    type: "checkbox",
                                    default: false
                                },{
                                    id: "display.inventoryMode.range",
                                    type: "checkbox",
                                    default: false
                                },
								{
                                    id: "display.inventoryMode.dim",
                                    type: "checkbox",
                                    default: false
                                }
                            ]
                        ]
                    }
                ]
            },{
                id: `inventoryMode-offset-wrapper`,
                type: "wrapper",
                visibility: { showOn: [ { [`inventoryMode.mode`]: "offset" } ] },
                settings:
                [
                    {
                        type: "line-right"
                    },{
                        label: localize("Offset", "MD"),
                        id: "inventoryMode.offset.mode",
                        type: "select",
                        link: getDocs('#offset'),
                        options: [
                            { value: "set", label: localize("SetToValue", "MD") },
                            { value: "increment", label: localize("IncreaseDecrease", "MD") }
                        ]
                    },{
                        label: localize("Value", "SWADE"),
                        id: "inventoryMode.offset.value",
                        type: "number",
                        step: "1",
                        default: "0",
                        indent: true
                    },{
                        type: "line-right"
                    },{
                        label: localize("Display", "MD"),
                        id: "inventoryMode-offset-display-table",
                        type: "table",
                        columns: 
                        [
                            { label: localize("Icon", "MD") },
                            { label: localize("Offset", "MD") }
                        ],
                        rows: 
                        [
                            [
                                {
                                    id: "display.inventoryMode.offsetIcon",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.inventoryMode.offset",
                                    type: "checkbox",
                                    default: true
                                }
                            ]
                        ]
                    }
                ]
            },{
                id: `inventoryMode-setSync-wrapper`,
                type: "wrapper",
                indent: "true",
                visibility: { showOn: [ { [`inventoryMode.mode`]: "setSyncFilter" } ] },
                settings: [
                    ...inventoryMode.getSelectionSettings('.setSync', undefined),
                    {
                        label: localize("Display", "MD"),
                        id: "inventoryMode-setSync-display-table",
                        type: "table",
                        columnVisibility: [
                            true,
                            true
                        ],
                        columns: 
                        [
                            { label: localize("Icon", "MD") },
                            { label: localize("Filter") },
                            { label: localize("Name", "ALL") }
                        ],
                        rows: 
                        [
                            [
                                {
                                    id: "display.inventoryMode.setSync.icon",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.inventoryMode.setSync.filter",
                                    type: "checkbox",
                                    default: true
                                },{
                                    id: "display.inventoryMode.setSync.name",
                                    type: "checkbox",
                                    default: true
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    }
}

function getItemTypes() {
    return [
        {value: 'any', label: Helpers.localize('Any', 'MD') },
        {value: 'weapon', label: Helpers.localize('TYPES.Item.weapon', 'ALL') },
        {value: 'gear', label: Helpers.localize('TYPES.Item.gear', 'ALL') },
        {value: 'consumable', label: Helpers.localize('TYPES.Item.consumable', 'ALL') },
        {value: 'armor', label: Helpers.localize('TYPES.Item.armor', 'ALL') },
        {value: 'shield', label: Helpers.localize('TYPES.Item.shield', 'ALL') }
    ]
}

function getItem(actor, settings) {
	let items = [];
	
	//Filter items
	const filter = settings.selection.filter;
	if (filter.equipped) items.push(...actor.items.filter(i => i.system.equipStatus > 1));
    if (filter.carried) items.push(...actor.items.filter(i => i.system.equipStatus === 1));
    if (filter.stored) items.push(...actor.items.filter(i => i.system.equipStatus === 0));
	
	if (settings.mode === 'any') 
        items = items.filter(i => i.type === 'weapon' || i.type === 'gear' || i.type === 'consumable' || i.type === 'armor' || i.type === 'shield')
    else
        items = items.filter(i => i.type === settings.mode);
	
	items = game.materialDeck.Helpers.sort(items, settings.selection.order);
	
	if (!items || items.length === 0) return;
	
	let item;
	if (settings.selection.mode === 'nr') {
        let itemNr = parseInt(settings.selection.nr) - 1 + inventoryOffset;
        item = items[itemNr];
    }
	else if (settings.selection.mode === 'nameId') {
        item = items.find(i => i.id === settings.selection.nameId.split('.').pop());
        if (!item) item = items.find(i => i.name === settings.selection.nameId);
        if (!item) item = items.find(i => game.materialDeck.Helpers.stringIncludes(i.name, settings.selection.nameId));
    }
	return item;
}

function useItem(item, settings) {
    const rollType = settings.rollType === 'default' ? Helpers.rollType.get(true) : settings.rollType;

    Helpers.useItem(item, 
        {
            rollType
        }
    );
} 

function getItemOnPressSettings(type='keyUp') {
    return [
        {
            label: localize(type=='keyUp' ? 'OnPress' : 'OnHold', 'MD'),
            id: `inventoryMode.${type}.mode`,
            type: "select",
            link: getDocs("#use-item"),
            options: [
                { value: 'doNothing', label: localize('DoNothing', 'MD') },
                { value: 'useItem', label: localize('Consumable.Use', 'SWADE') },
                { value: 'equip', label: localize('Equip', 'SWADE') },
                { value: 'setQuantity', label: localize('SetQuantity') },
                { value: 'setCharges', label: localize('SetCharges') }
            ]
        },{
            id: `inventoryMode-${type}-useItem-wrapper`,
            type: "wrapper",
            indent: true,
            visibility: { showOn: [ { [`inventoryMode.${type}.mode`]: "useItem" } ] },
            settings:
            [
                {
                    label: localize('RollType'),
                    id: `inventoryMode.${type}.rollType`,
                    type: "select",
                    default: "default",
                    options: Helpers.getRollTypes()
                }
            ]
        },{
            label: localize("Mode", "MD"),
            id: `inventoryMode.${type}.equip.mode`,
            type: "select",
            indent: true,
            visibility: { showOn: [ { [`inventoryMode.${type}.mode`]: "equip" } ] },
            options: [
                { value: 'toggle', label: localize('Toggle', 'MD') },
                { value: 'equip', label: localize('Equip', 'SWADE') },
                { value: 'unequip', label: localize('Unequip') }
            ]
        },{
            id: `inventoryMode-${type}-setQuantity-wrapper`,
            type: "wrapper",
            indent: true,
            visibility: { showOn: [{ [`inventoryMode.${type}.mode`]: "setQuantity" } ]},
            settings:
            [
                {
                    label: localize("Mode", "MD"),
                    id: `inventoryMode.${type}.setQuantity.mode`,
                    type: "select",
                    options: [
                        { value: "set", label: localize("SetToValue", "MD") },
                        { value: "increment", label: localize("IncreaseDecrease", "MD") }
                    ]
                },{
                    label: localize("Value", "SWADE"),
                    id: `inventoryMode.${type}.setQuantity.value`,
                    type: "number",
                    step: "1",
                    default: "0"
                }
            ]
        },{
            id: `inventoryMode-${type}-setCharges-wrapper`,
            type: "wrapper",
            indent: true,
            visibility: { showOn: [{ [`inventoryMode.${type}.mode`]: "setCharges" } ]},
            settings:
            [
                {
                    label: localize("Mode", "MD"),
                    id: `inventoryMode.${type}.setCharges.mode`,
                    type: "select",
                    options: [
                        { value: "reset", label: localize("Reset", "ALL") },
                        { value: "set", label: localize("SetToValue", "MD") },
                        { value: "increment", label: localize("IncreaseDecrease", "MD") }
                    ]
                },{
                    label: localize("Value", "SWADE"),
                    id: `inventoryMode.${type}.setCharges.value`,
                    type: "number",
                    step: "1",
                    default: "0",
                    visibility: { hideOn: [{ [`inventoryMode.${type}.setCharges.mode`]: "reset" } ]}
                }
            ]
        }
    ]
}