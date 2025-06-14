import { tokenAction } from "./actions/token.js";
import { otherAction } from "./actions/other.js";
import { combatTrackerAction } from "./actions/combatTracker.js";
import { Helpers } from "./helpers.js";

const moduleId = 'materialdeck-swade';
export const documentation = "https://materialfoundry.github.io/MaterialDeck_SWADE/";

Hooks.once('MaterialDeck_Ready', () => {
    Helpers.rollType = new game.materialDeck.Helpers.ModeSwitcher('default', 'mdUpdateRollType');
    Helpers.rollModifier = new game.materialDeck.Helpers.ModeSwitcher('normal', 'mdUpdateRollModifier');
   
    const moduleData = game.modules.get(moduleId);

    game.materialDeck.registerSystem({
        systemId: 'swade',
        moduleId,
        systemName: 'Savage Worlds Adventure Edition',
        version: moduleData.version,
        manifest: moduleData.manifest,
        documentation, 
        actions: [
            tokenAction,
            otherAction,
            combatTrackerAction
        ]
    });
});