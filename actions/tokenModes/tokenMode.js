import { Helpers } from "../../helpers.js";

const localize = Helpers.localize;

function getDocs(path, action="token") {
    return Helpers.getDocumentationUrl(path, action);
}

export const tokenMode = {

    getActions: function(settings) {
        let actions = { update: [], keyDown: [], keyUp: [], hold: [] };

        const stats = settings.tokenMode.stats.mode;
        
        if (stats === "Wounds") {
            actions.update.push({
                run: this.onUpdateWounds,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
		else if (stats === "Fatigue") {
            actions.update.push({
                run: this.onUpdateFatigue,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
		else if (stats === "PowerPoints") {
            actions.update.push({
                run: this.onUpdatePowerPoints,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Parry") {
            actions.update.push({
                run: this.onUpdateParry,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Toughness") {
            actions.update.push({
                run: this.onUpdateToughness,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Pace") {
            actions.update.push({
                run: this.onUpdatePace,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Currency") {
            actions.update.push({
                run: this.onUpdateCurrency,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Encumbrance") {
            actions.update.push({
                run: this.onUpdateEncumbrance,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Advances") {
            actions.update.push({
                run: this.onUpdateAdvances,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Attribute") {
            actions.update.push({
                run: this.onUpdateAttribute,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
        else if (stats === "Skill") {
            actions.update.push({
                run: this.onUpdateSkill,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }
		else if (stats === "Status") {
            actions.update.push({
                run: this.onUpdateStatus,
                on: ['updateActor', 'createToken', 'deleteToken', 'updateActiveEffect'],
                source: 'stats'
            });
        }
		else if (stats === "Bennies") {
            actions.update.push({
                run: this.onUpdateBennies,
                on: ['updateActor', 'createToken', 'deleteToken'],
                source: 'stats'
            });
        }

        const onPress = settings.tokenMode.keyUp?.mode;
        const onHold = settings.tokenMode.hold?.mode;
        const holdTime = game.materialDeck.holdTime;

        if (onPress === 'status') {
            actions.update.push({
                run: this.onUpdateStatuses,
                on: ['createActiveEffect', 'deleteActiveEffect', 'updateActiveEffect'],
                source: 'onPress'
            });
            actions.keyUp.push({
                run: this.onKeydownStatuses,
                source: 'onPress',
                stopOnHold: true
            });
        }
        else if (onPress === 'roll') {
            actions.keyUp.push({
                run: this.onKeydownRoll,
                source: 'onPress',
                stopOnHold: true
            });
        }
		else if (onPress === 'bennies') {
            actions.keyUp.push({
                run: this.onKeydownBenny,
                source: 'onPress',
                stopOnHold: true
            });
        }
		else if (onPress === 'wounds') {
            actions.keyUp.push({
                run: this.onKeydownWounds,
                source: 'onPress',
                stopOnHold: true
            });
        }
		else if (onPress === 'fatigue') {
            actions.keyUp.push({
                run: this.onKeydownFatigue,
                source: 'onPress',
                stopOnHold: true
            });
        }
		else if (onPress === 'powerpoints') {
            actions.keyUp.push({
                run: this.onKeydownPP,
                source: 'onPress',
                stopOnHold: true
            });
        }

        if (onHold === 'status') {
            actions.hold.push({
                run: this.onKeydownStatuses,
                delay: holdTime,
                source: 'onPress'
            });
        }
        else if (onHold === 'roll') {
            actions.hold.push({
                run: this.onKeydownRoll,
                delay: holdTime,
                source: 'onPress'
            });
        }
		else if (onHold === 'bennies') {
            actions.hold.push({
                run: this.onKeydownBenny,
                delay: holdTime,
                source: 'onPress'
            });
        }
		else if (onHold === 'wounds') {
            actions.hold.push({
                run: this.onKeydownWounds,
                delay: holdTime,
                source: 'onPress'
            });
        }
		else if (onHold === 'fatigue') {
            actions.hold.push({
                run: this.onKeydownFatigue,
                delay: holdTime,
                source: 'onPress'
            });
        }
		else if (onHold === 'powerpoints') {
            actions.hold.push({
                run: this.onKeydownPP,
                delay: holdTime,
                source: 'onPress'
            });
        }

        return actions;
    },

    /****************************************************************
     * Stats
     ****************************************************************/
    onUpdateWounds: function(data) {
        const settings = data.settings.tokenMode.stats;

        let text = "";
        let wounds = {value: 0, max: 0};
      
        if (data.actor) {
            wounds = data.actor.system.wounds;
            if (settings.mode === "Wounds" && settings.wounds.mode === 'nr') 
                text = wounds.value + "/" + wounds.max;
        }
        
        return {
            text, 
            icon: settings.mode === 'Wounds' && data.settings.display.icon === 'stats' ? Helpers.getImage("hp_empty.png") : "", 
            options: {
                uses: {
                    available: wounds.value,
                    maximum: wounds.max,
                    heart: (settings.mode === 'Wounds' && data.settings.display.icon === 'stats') ? "#FF0000" : undefined,
                    box: settings.wounds.mode === 'box',
                    bar: settings.wounds.mode === 'bar'
                }
            }
        };
    },
	
	onUpdateFatigue: function(data) {
        const settings = data.settings.tokenMode.stats;

        let text = "";
        let fatigue = {value: 0, max: 0};
      
        if (data.actor) {
            fatigue = data.actor.system.fatigue;
            if (settings.mode === "Fatigue" && settings.fatigue.mode === 'nr') 
                text = fatigue.value + "/" + fatigue.max;
        }
        
        return {
            text, 
            icon: settings.mode === 'Fatigue' && data.settings.display.icon === 'stats' ? Helpers.getImage("fatigue_empty.png") : "", 
            options: {
                uses: {
                    available: fatigue.value,
                    maximum: fatigue.max,
                    heart: (settings.mode === 'Fatigue' && data.settings.display.icon === 'stats') ? "#00FF00" : undefined,
                    box: settings.fatigue.mode === 'box',
                    bar: settings.fatigue.mode === 'bar'
                }
            }
        };
    },
	
	onUpdatePowerPoints: function(data) {
        const settings = data.settings.tokenMode.stats;

        let text = "";
        let pp = {value: 0, max: 0};
      
        if (data.actor) {
            data.actor.system.powerPoints[settings.pp.source] ? pp = data.actor.system.powerPoints[settings.pp.source] : ''
            if (settings.mode === "PowerPoints" && settings.pp.mode === 'nr') 
                text = pp.value + "/" + pp.max;
        }
        
        return {
            text, 
            icon: settings.mode === 'PowerPoints' && data.settings.display.icon === 'stats' ? Helpers.getImage("powerpoints_empty.png") : "", 
            options: {
                uses: {
                    available: pp.value,
                    maximum: pp.max,
                    heart: (settings.mode === 'PowerPoints' && data.settings.display.icon === 'stats') ? "#0000FF" : undefined,
                    box: settings.pp.mode === 'box',
                    bar: settings.pp.mode === 'bar'
                }
            }
        };
    },

    onUpdateParry: function(data) {
        return {
            text: data.actor ? data.actor.system.stats.parry.value : '', 
            icon: data.settings.display.icon == 'stats' ? 'icons/equipment/shield/heater-steel-worn.webp' : '',
			options: { dim: data.settings.display.icon == 'stats' }
        }
    },

    onUpdateToughness: function(data) {
        return {
            text: data.actor ? data.actor.system.stats.toughness.value : '', 
            icon: data.settings.display.icon == 'stats' ? 'icons/equipment/chest/breastplate-cuirass-steel-grey.webp' : '',
			options: { dim: data.settings.display.icon == 'stats' }
        }
    },

    onUpdatePace: function(data) {
        let text = "";

        if (data.actor) {
            const movement = data.actor.system.pace;
			const settings = data.settings.tokenMode.stats;
			
			if (!settings) return;
			
            if (settings.pace.filter.ground && movement.ground > 0) {
                if (text.length > 0) text += '\n';
                text += `${localize("Movement.Pace.Ground.Label", "SWADE")}: ${movement.ground}`;
            }
			if (settings.pace.filter.fly && movement.fly > 0) {
                if (text.length > 0) text += '\n';
                text += `${localize("Movement.Pace.Fly.Label", "SWADE")}: ${movement.fly}`;
            }
            if (settings.pace.filter.swim && movement.swim > 0) {
                if (text.length > 0) text += '\n';
                text += `${localize("Movement.Pace.Swim.Label", "SWADE")}: ${movement.swim}`;
            }
            if (settings.pace.filter.burrow && movement.burrow > 0) {
				if (text.length > 0) text += '\n';
				text += `${localize("Movement.Pace.Burrow.Label", "SWADE")}: ${movement.burrow}`;
			}
        }
        
        return{
            text, 
            icon: data.settings.display.icon === 'stats' ? 'icons/equipment/feet/shoes-collared-leather-blue.webp' : "",
			options: { dim: data.settings.display.icon == 'stats' }
        };
    },

    onUpdateCurrency: function(data) {
        let text = '';
		if (data.actor) {
        const currency = data.actor.system?.details?.currency;
        text += currency;
		}
        
        return {
            text, 
            icon: data.settings.display.icon === 'stats' ? 'fas fa-coins' : ''
        }
    },

    onUpdateEncumbrance: function(data) {
        if (data.actor) {
		const encumbrance = data.actor?.system?.details?.encumbrance;
        return {
            text: `${encumbrance.value}/${encumbrance.max}`, 
            icon: data.settings.display.icon == 'stats' ? Helpers.getImage('weight.png') : '',
            options: { dim: data.settings.display.icon == 'stats' }
        }
		}
    },

    onUpdateAdvances: function(data) {
        const settings = data.settings.tokenMode.stats;
        let text = '';
        const advances = data.actor?.system?.advances;
		text = advances?.value;
        
        return {
            text, 
            icon: data.settings.display.icon == 'stats' ? Helpers.getImage('progression.png') : '',
			options: { dim: data.settings.display.icon == 'stats' }
        }
    },

    onUpdateAttribute: function(data) {
        const statsMode = data.settings.tokenMode.stats.mode;
        const attribute = data.settings.tokenMode.stats.attribute;

        let text = "";
        
        if (data.actor) {
            if (statsMode == "Attribute")
                text += "d" + data.actor.system.attributes?.[attribute].die.sides;
        }
        
        return {
            text, 
            icon: data.settings.display.icon == 'stats' ? Helpers.getImage(`attributes/${attribute}.png`) : '', 
            options: { dim: data.settings.display.icon == 'stats' }
        };
    },

    onUpdateSkill: function(data) {
        const statsMode = data.settings.tokenMode.stats.mode;
        const settings = data.settings.tokenMode.stats;
        let text = "";
		let icon = "";
		
		if (data.actor) {
			let skill;
			if (statsMode === "Skill") {
				if (settings.skill === "Custom Skill") { skill = data.actor.items?.getName(settings.customskill);}
				else { skill = data.actor.items?.getName(settings.skill); }
				if (skill) { 
					let mod = skill.system.die.modifier;
					let sides = skill.system.die.sides;
					if (mod > 0) { text += "d" + sides + "+" + mod; }
					else if (mod < 0) { text += "d" + sides + mod; }
					else { text += "d" + sides; }
				}
				else {
					skill = data.actor.items.getName("Unskilled Attempt");
					if (skill) { 
						let mod = skill.system.die.modifier;
						let sides = skill.system.die.sides;
						if (mod > 0) { text += "d" + sides + "+" + mod; }
						else if (mod < 0) { text += "d" + sides + mod; }
						else { text += "d" + sides; }
					}
				}
				if (skill) { icon = skill.img; }
			}
		}
        
        return {
            text, 
            icon: data.settings.display.icon == 'stats' ? icon : '', 
            options: { dim: data.settings.display.icon == 'stats' }
        };
    },
	
	onUpdateStatus: function(data) {
        const statsMode = data.settings.tokenMode.stats.mode;
        const settings = data.settings.tokenMode.stats;
		const statusActive = data.actor ? getStatusActive(data.actor, settings.status) : false;
		const displayIcon = data.settings.display.icon === 'stats';
        let text = "";
		let icon = "";
			
        return {
            icon: displayIcon ? getStatusIcon(settings.status) : '', 
            options: { 
                dim: displayIcon,
                border: true,
                borderColor: statusActive ? data.settings.colors.on : data.settings.colors.system.off
            }
        };        
    },
	onUpdateBennies: function(data) {
        return {
            text: data.actor ? data.actor.bennies : '', 
            icon: data.settings.display.icon == 'stats' ? 'systems/swade/assets/bennie.webp' : ''
        }
    },

    /****************************************************************
     * On Press
     ****************************************************************/

    onUpdateStatuses: async function(data) {
        const settings = data.settings.tokenMode.keyUp.status;
        if ((data.hook === 'createActiveEffect' || data.hook === 'deleteActiveEffect') && data.args[0].parent.id !== data.actor.id) return 'doNothing';

        const statusActive = data.actor ? getStatusActive(data.actor, settings.status) : false;
        const displayIcon = data.settings.display.icon === 'stats';

        return {
            icon: displayIcon ? getStatusIcon(settings.status) : '', 
            options: { 
                dim: displayIcon,
                border: true,
                borderColor: statusActive ? data.settings.colors.on : data.settings.colors.system.off
            }
        };
    },

    onKeydownStatuses: async function(data) {
        const settings = data.settings.tokenMode[data.actionType].status;

        if (settings.status === 'removeAll') {
            for( let effect of data.actor?.effects)
                if (effect.statusId) { effect.delete(); } // Remove just status effects, not other active effects
		}
        else { data.actor?.toggleActiveEffect(settings.status); }
    },

    onKeydownRoll: function(data) {
		const settings = data.settings.tokenMode[data.actionType].roll;
        const rollMode = settings.type/// === 'default' ? Helpers.rollModifier.get(true) : settings.type;

        const rollData = {
            attribute: settings.attribute,
            skill: settings.skill,
            rolls: [ {
                options: {}
            } ]
        };

        const dialogOptions = {
            configure: rollMode === 'dialog'
        };

        if (settings.mode === 'attribute') data.actor?.rollAttribute(rollData.attribute, dialogOptions);
        else if (settings.mode === 'skill') {
			let skill;
			if (rollData.skill === "Custom Skill") { skill = data.actor?.items?.getName(settings.customskill); }
			else { skill = data.actor?.items?.getName(rollData.skill); }
			skill ? skill.roll(dialogOptions) : data.actor?.makeUnskilledAttempt()
		}
		else if (settings.mode === 'running') data.actor?.rollRunningDie();
    },
	
	onKeydownBenny: function(data) {
		const settings = data.settings.tokenMode[data.actionType];
		if (settings.bennies.bennies === 'giveBenny') { data.actor?.getBenny(); }
		else if (settings.bennies.bennies === 'spendBenny') { data.actor?.spendBenny(); }
	},
	
	onKeydownWounds: async function(data) {
		const settings = data.settings.tokenMode[data.actionType];
		const value = data.actor?.system?.wounds?.value;
		const max = data.actor?.system?.wounds?.max;
		if (settings.wounds.wounds === 'addWound' && (value < max)) { await data.actor.update({'system.wounds.value': data.actor.system.wounds.value + 1,}); }
		else if (settings.wounds.wounds === 'removeWound' && (value > 0)) { await data.actor.update({'system.wounds.value': data.actor.system.wounds.value - 1,}); }
		else if (settings.wounds.wounds === 'removeAllWounds') { await data.actor.update({'system.wounds.value': 0,}); }
	},
	
	onKeydownFatigue: async function(data) {
		const settings = data.settings.tokenMode[data.actionType];
		const value = data.actor?.system?.fatigue?.value;
		const max = data.actor?.system?.fatigue?.max;
		if (settings.fatigue.fatigue === 'addFatigue' && (value < max)) { await data.actor.update({'system.fatigue.value': data.actor.system.fatigue.value + 1,}); }
		else if (settings.fatigue.fatigue === 'removeFatigue' && (value > 0)) { await data.actor.update({'system.fatigue.value': data.actor.system.fatigue.value - 1,}); }
		else if (settings.fatigue.fatigue === 'removeAllFatigue') { await data.actor.update({'system.fatigue.value': 0,}); }
	},
	
	onKeydownPP: async function(data) {
		const settings = data.settings.tokenMode[data.actionType];
		const source = settings.pp.source;
		const value = data.actor?.system?.powerPoints[source].value;
		const max = data.actor?.system?.powerPoints[source].max;
		if ((settings.pp.pp === 'addPP') && (value < max)) { await data.actor.update({[`system.powerPoints.${source}.value`]: data.actor.system.powerPoints[source].value + 1,}); }
		else if (settings.pp.pp === 'removePP' && (value > 0)) { await data.actor.update({[`system.powerPoints.${source}.value`]: data.actor.system.powerPoints[source].value - 1,}); }
		else if (settings.pp.pp === 'restoreAllPP') { await data.actor.update({[`system.powerPoints.${source}.value`]: max,}); }
	},

    /****************************************************************
     * Get settings
     ****************************************************************/

    getSettings: function() {
        return [
            ...getTokenStats('pageWide.stats'),
            ...getTokenOnPress('keyUp', 'pageWide.keyUp'),
            ...getTokenOnPress('hold', 'pageWide.hold'),
        ]
    }
}

export function getTokenStats(sync) {
    return [
        {
            id: "tokenMode.stats.mode",
            appendOptions: [
				{ value: 'Advances', label: localize('Adv', 'SWADE') },
				{ value: 'Attribute', label: localize('Attribute', 'SWADE') },
				{ value: 'Bennies', label: localize('Bennies', 'SWADE') },
				{ value: 'Currency', label: localize('Currency', 'SWADE') },
				{ value: 'Encumbrance', label: localize('Encumbrance') },
				{ value: 'Fatigue', label: localize('Fatigue', 'SWADE') },
				{ value: 'Pace', label: localize('Pace', 'SWADE') },
				{ value: 'Parry', label: localize('Parry', 'SWADE') },
				{ value: 'PowerPoints', label: localize('PP', 'SWADE') },
				{ value: 'Skill', label: localize('Skill') },
				{ value: 'Status', label: localize('Status', 'SWADE') },
				{ value: 'Toughness', label: localize('Tough', 'SWADE') },
                { value: 'Wounds', label: localize('Wounds', 'SWADE') }
            ]
        },{
            id: "swade-tokenMode-stats-wrapper",
            type: "wrapper",
            after: "tokenMode.stats.mode",
            indent: 1,
            settings: [
                {
                    label: localize('Mode', 'MD'),
                    id: "tokenMode.stats.wounds.mode",
                    type: "select",
                    default: "nr",
                    sync,
                    options: [
                        {value:'nr', label: localize('Number', 'SWADE') },
                        {value:'box', label: `${localize('Box', 'MD')}` },
                        {value:'bar', label: `${localize('Bar', 'MD')}` }
                    ],
                    visibility: { showOn: [ 
                        { ["tokenMode.stats.mode"]: "Wounds" }
                    ] }
                },
				{
                    label: localize('Mode', 'MD'),
                    id: "tokenMode.stats.fatigue.mode",
                    type: "select",
                    default: "nr",
                    sync,
                    options: [
                        {value:'nr', label: localize('Number', 'SWADE') },
                        {value:'box', label: `${localize('Box', 'MD')}` },
                        {value:'bar', label: `${localize('Bar', 'MD')}` }
                    ],
                    visibility: { showOn: [ 
                        { ["tokenMode.stats.mode"]: "Fatigue" }
                    ] }
                },{
                    label: localize('Source', 'SWADE'),
                    id: "tokenMode.stats.pp.source",
                    type: "textbox",
                    sync,
                    default: "general",
                    visibility: {
                        showOn: [
                            { ["tokenMode.stats.mode"]: "PowerPoints" }
                        ]
                    }
                },{
                    label: localize('Mode', 'MD'),
                    id: "tokenMode.stats.pp.mode",
                    type: "select",
                    default: "nr",
                    sync,
                    options: [
                        {value:'nr', label: localize('Number', 'SWADE') },
                        {value:'box', label: `${localize('Box', 'MD')}` },
                        {value:'bar', label: `${localize('Bar', 'MD')}` }
                    ],
                    visibility: { showOn: [ 
                        { ["tokenMode.stats.mode"]: "PowerPoints" }
                    ] }
                },{
					label: localize("PaceFilter"),
					id: "tokenMode-pace-filter-table",
					type: "table",
					visibility: { 
					showOn: [ 
						{ ["tokenMode.stats.mode"]: "Pace" }
					] 
				},
					columns: 
					[
						{ label: localize('Movement.Pace.Ground.Label', 'SWADE') },
						{ label: localize('Movement.Pace.Fly.Label', 'SWADE') },
						{ label: localize('Movement.Pace.Swim.Label', 'SWADE') },
						{ label: localize('Movement.Pace.Burrow.Label', 'SWADE') }
					],
					rows: 
					[
						[
							{ 
								id: "tokenMode.stats.pace.filter.ground",
								type: "checkbox",
								sync,
								default: true
							},{ 
								id: "tokenMode.stats.pace.filter.fly",
								type: "checkbox",
								sync,
								default: true
							},{ 
								id: "tokenMode.stats.pace.filter.swim",
								type: "checkbox",
								sync,
								default: true
							},{ 
								id: "tokenMode.stats.pace.filter.burrow",
								type: "checkbox",
								sync,
								default: true
							}
						]
					]
				},{
                    label: localize('Attribute', 'SWADE'),
                    id: "tokenMode.stats.attribute",
                    type: "select",
                    sync,
                    default: "agility",
                    visibility: {
                        showOn: [
                            { ["tokenMode.stats.mode"]: "Attribute" }
                        ]
                    },
                    options: getAttributeList()
                },{
                    label: localize('Skill'),
                    id: "tokenMode.stats.skill",
                    type: "select",
                    sync,
                    visibility: { showOn: [ { ["tokenMode.stats.mode"]: "Skill" } ] },
                    options: getSkillList()
                },{
                    label: localize('CustomSkill'),
                    id: "tokenMode.stats.customskill",
                    type: "textbox",
                    sync,
                    visibility: { showOn: [ { ["tokenMode.stats.skill.value"]: "Custom Skill" } ] },
                },
				{
                    label: localize('Status', 'SWADE'),
                    id: "tokenMode.stats.status",
                    type: "select",
                    sync,
                    visibility: { showOn: [ { ["tokenMode.stats.mode"]: "Status" } ] },
                    options: getStatusList()
                }
            ]
        }
    ]
}

function getTokenOnPress(mode='keyUp', sync) {
    return [
        {
            id: `tokenMode.${mode}.mode`,
            appendOptions: [
                { value: 'status', label: localize('ToggleStatus') },
                { value: 'roll', label: localize('DiceRoll') },
				{ value: 'bennies', label: localize('ManageBennies') },
				{ value: 'wounds', label: localize('ManageWounds') },
				{ value: 'fatigue', label: localize('ManageFatigue') },
				{ value: 'powerpoints', label: localize('ManagePowerPoints') }
            ]
        },{
            id: `swade-${mode}-wrapper`,
            type: "wrapper",
            after: `tokenMode.${mode}.mode`,
            indent: 1,
            settings: [
                {
                    label: localize('Status', 'SWADE'),
                    id: `tokenMode.${mode}.status.status`,
                    type: "select",
                    sync,
                    indent: 1,
                    link: getDocs('#token-mode'),
                    visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "status" } ] },
                    options: [
                        { value: "removeAll", label: localize("RemoveAll") },
                        { label: localize("Status", "SWADE"), children: getStatusList() }
                    ]
                },{
                    id: `swade-${mode}-roll-wrapper`,
                    type: "wrapper",
                    visibility: { showOn: [ {[`tokenMode.${mode}.mode`]: "roll"} ] },
                    settings: [
                        {
                            label: "Roll",
                            id: `tokenMode.${mode}.roll.mode`,
                            type: "select",
                            sync,
                            link: getDocs('#dice-roll'),
                            options: [
                                {value:'attribute', label: localize('AttributeTest', 'SWADE')},
                                {value:'skill', label: localize('SkillTest', 'SWADE')},
								{value:'running', label: localize('RunningDie','SWADE')}
                            ]
                        },{
                            label: localize('Attribute', 'SWADE'),
                            id: `tokenMode.${mode}.roll.attribute`,
                            type: "select",
                            sync,
                            indent: true,
                            visibility: { showOn: [ { [`tokenMode.${mode}.roll.mode`]: "attribute" } ] },
                            options: getAttributeList()
                        },{
                            label: localize('Skill'),
                            id: `tokenMode.${mode}.roll.skill`,
                            type: "select",
                            sync,
                            indent: true,
                            visibility: { showOn: [ { [`tokenMode.${mode}.roll.mode`]: "skill" } ] },
                            options: getSkillList()
                        },{
                            label: localize('CustomSkill'),
                            id: `tokenMode.${mode}.roll.customskill`,
                            type: "textbox",
                            sync,
                            indent: true,
                            visibility: { showOn: [ { [`tokenMode.${mode}.roll.skill`]: "Custom Skill" } ] }
                        }
                    ]
                },{
					label: localize("Bennies", "SWADE"),
					id: `tokenMode.${mode}.bennies.bennies`,
					type: "select",
					sync,
					indent: true,
					link: getDocs('#token-mode'),
					visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "bennies" } ] },
					options: [{value: "giveBenny", label: localize("BenniesGive","SWADE")},{value: "spendBenny", label: localize("BenniesSpend","SWADE")}]
				},{
					label: localize("Wounds", "SWADE"),
					id: `tokenMode.${mode}.wounds.wounds`,
					type: "select",
					sync,
					indent: true,
					link: getDocs('#token-mode'),
					visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "wounds" } ] },
					options: [{value: "addWound", label: localize("AddWound")},{value: "removeWound", label: localize("RemoveWound")},{value: "removeAllWounds", label: localize("RemoveAllWounds")}]
				},{
					label: localize("Fatigue", "SWADE"),
					id: `tokenMode.${mode}.fatigue.fatigue`,
					type: "select",
					sync,
					indent: true,
					link: getDocs('#token-mode'),
					visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "fatigue" } ] },
					options: [{value: "addFatigue", label: localize("AddFatigue")},{value: "removeFatigue", label: localize("RemoveFatigue")},{value: "removeAllFatigue", label: localize("RemoveAllFatigue")}]
				},{
					label: localize("PP", "SWADE"),
					id: `tokenMode.${mode}.pp.pp`,
					type: "select",
					sync,
					indent: true,
					link: getDocs('#token-mode'),
					visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "powerpoints" } ] },
					options: [{value: "addPP", label: localize("AddPP")},{value: "removePP", label: localize("RemovePP")},{value: "restoreAllPP", label: localize("RestoreAllPP")}]
				},{
					label: localize("Source", "SWADE"),
					id: `tokenMode.${mode}.pp.source`,
					type: "textbox",
					sync,
					indent: true,
					link: getDocs('#token-mode'),
					visibility: { showOn: [ { [`tokenMode.${mode}.mode`]: "powerpoints" } ] },
					default: "general"
				}
            ]
        }
    ]
}

function getStatusIcon(status) {
    if (status == 'removeAll') 
        return window.CONFIG.controlIcons.effects;
    return CONFIG.statusEffects.find(e => e.id === status).img;
}

function getStatusActive(actor, status) {
    if (status === 'removeAll') 
        return actor.statuses.size > 0;
    else
        return actor.statuses.has(status);
}

function getAttributeList() {
    let attributes = [{value: "agility", label: localize("AttrAgi", "SWADE")}, {value: "smarts", label: localize("AttrSma", "SWADE")}, {value: "spirit", label: localize("AttrSpr", "SWADE")}, {value: "strength", label: localize("AttrStr", "SWADE")}, {value: "vigor", label: localize("AttrVig", "SWADE")}];
    return attributes;
}

function getSkillList() {
	let skills = [{value: "Academics", label: "Academics"}, {value: "Athletics", label: "Athletics"}, {value: "Battle", label: "Battle"}, {value: "Boating", label: "Boating"}, {value: "Common Knowledge", label: "Common Knowledge"}, {value: "Driving", label: "Driving"}, {value: "Electronics", label: "Electronics"}, {value: "Faith", label: "Faith"}, {value: "Fighting", label: "Fighting"}, {value: "Focus", label: "Focus"}, {value: "Gambling", label: "Gambling"}, {value: "Hacking", label: "Hacking"}, {value: "Healing", label: "Healing"}, {value: "Intimidation", label: "Intimidation"}, {value: "Language", label: "Language"}, {value: "Notice", label: "Notice"}, {value: "Occult", label: "Occult"}, {value: "Performance", label: "Performance"}, {value: "Persuasion", label: "Persuasion"}, {value: "Piloting", label: "Piloting"}, {value: "Psionics", label: "Psionics"}, {value: "Repair", label: "Repair"}, {value: "Research", label: "Research"}, {value: "Riding", label: "Riding"}, {value: "Science", label: "Science"}, {value: "Shooting", label: "Shooting"}, {value: "Spellcasting", label: "Spellcasting"}, {value: "Stealth", label: "Stealth"}, {value: "Survival", label: "Survival"}, {value: "Taunt", label: "Taunt"}, {value: "Thievery", label: "Thievery"}, {value: "Weird Science", label: "Weird Science"},{value: "Custom Skill", label: localize("CustomSkill")}];	
    return skills;
}

function getStatusList() {
    let statuses = [];
    for (let s of CONFIG.statusEffects) 
        statuses.push({
            value: s.id, 
            label: localize(s.name,"ALL")
        });
    return statuses.sort((a,b) => a.value.localeCompare(b.value));;
}