import { documentation } from "./materialdeck-swade.js"

export class Helpers {

    static getDocumentationUrl(path, action) {
        let url = `${documentation}/actions/${action}/${path}`;
        return url;
    }
    
    static localize(str, category='', formatData) {
        if (category === '') return game.i18n.format(`MATERIALDECK_SWADE.${str}`, formatData);
        else if (category === 'ALL') return game.i18n.format(str, formatData);
        else if (category === 'MD') return game.i18n.format(`MATERIALDECK.${str}`, formatData);
        else if (category === 'SWADE') return game.i18n.format(`SWADE.${str}`, formatData);
        return game.i18n.format(`MATERIALDECK_SWADE.${category}.${str}`, formatData);
    }

    static getImage(name, path=`modules/materialdeck-swade/img/`) {
        return path + name;
    }

    static isInString(strTarget, strTest, ignoreCase=true) {
        if (strTest === '') return false;
        if (ignoreCase) return strTarget.toUpperCase().includes(strTest.toUpperCase());
        else return strTarget.includes(strTest);
    }

	static async useItem(item, options) {
        const rollType = options.rollType;
		
		if (!item) return;
		if (rollType === 'use' || rollType === 'default') { return game.swade.rollItemMacro(item.name); }
		if (rollType === 'attack' && item.type === 'weapon') { 
			let skillName = item.system.actions?.trait;
			let skill = item.actor?.items?.getName(skillName);
			let comment = item.name + " Attack - " + skillName + " Skill Test";
			item.actor?.rollSkill(skill.id,{ title: comment, flavour: comment });
		}
		if (rollType === 'damage' ) { item.rollDamage(); }
	}
	
    /** 
     * Roll Types
     */
    static rollType;

    static getRollTypes() {
        return [
            { value: 'default', label: 'Default' },
            { value: 'attack', label: 'Attack' },
            { value: 'damage', label: localize('Dmg', 'SWADE') },
            { value: 'use', label: localize('Consumable.Use', 'SWADE') }
        ];
    }

    static getRollTypeIcon(type) {
        if (type === 'default') return 'fas fa-grip-lines';
        else if (type === 'attack') return 'fas fa-mace';
        else if (type === 'damage') return 'fas fa-face-head-bandage';
        else if (type === 'use') return 'fas fa-flask';
    }

}

const localize = Helpers.localize;