# Token Action

The SWADE module adds extra features to the base `Token` action, and adds the following new modes:

* [Token Mode](#token-mode): New `Stats`, `On Press` and `On Hold` options
* [Inventory Mode](#inventory-mode): Display and roll weapons and other items
* [Features Mode](#features-mode): Display and roll actor features
* [Effects Mode](#effects-mode): Display and toggle effects

## Token Mode
The [Token mode](https://materialfoundry.github.io/MaterialDeck/actions/token/token/#token-mode) has new `Stats`, `On Press` and `On Hold` options.

| Option            | Description   |
|-------------------|---------------|
| Stats             | Stat to display:<br><b>-Wounds</b><br><b>-Fatigue</b><br><b>-Power Points</b>: Can be set to any power point source.<br><b>-Bennies</b><br><b>-Parry</b><br><b>-Toughness</b><br><b>-Advances</b><br><b>-Currency</b><br><b>-Encumbrance</b><br><b>-Attribute</b>: Die of a specified attribute.<br><b>-Pace</b>: Can show one or more movement types at once.<br><b>-Skill</b>: Can select a default skill or input a custom skill name.<br><b>-Status</b>: Highlights the status when it is active.|
| On Press/On Hold  | Sets what to do when the button is pressed/held down:<br><b>-Manage Wounds</b>: Increase, decrease, or remove all wounds.<br><b>-Manage Fatigue</b>: Increase, decrease, or remove all fatigue.<br><b>-Manage Power Points</b>: Increase, decrease, or reset power points to maximum.<br><b>-Toggle Status</b>: Toggle a specified status or clear all statuses.<br><b>-[Dice Roll](#dice-roll)</b>: Roll an attribute, skill, or running die.<br><b>-Manage Bennies</b>: Add or spend a benny. |

### Dice Roll
`Dice Roll` allows you to roll for the selected token/actor.

| Option            | Description   |
|-------------------|---------------|
| Roll             | Type of roll:<br><b>-Attribute Test</b>: Roll an attribute test.<br><b>-Skill Test</b>: Roll a skill test.<br><b>-Running Die</b>: Roll the running die. |
| Attribute<br>(`Ability Test`)           | Attribute to roll.    |
| Skill<br>(`Skill Test`) | Skill to roll.   |

## Inventory Mode
The inventory mode can be used to display and control items in the token/actor's inventory.

| Option            | Description   |
|-------------------|---------------|
| Item Type         | <b>-Any</b>: Select any kind of item.<br><b>-Weapon</b>: Select from weapons.<br><b>-Gear</b>: Select from gear.<br><b>-Consumable</b>: Select from consumable items.<br><b>-Armor</b>: Select from armor.<br><b>-Shield</b>: Select from shields.<br><b>-[Set Type & Filter Sync](#synced-settings)</b>: Set the synced settings for this page. Will synchronize `Item Type` and `Selection Filter`.<br><b>-[Offset](#offset)</b>: Set item offsets. |
| Selection Filter  | Selects item parameters to filter out:<br><b>-Equipped</b>: Filters equipped items.<br><b>-Carried</b>: Filters carried items.<br><b>-Stored</b>: Filters items that are stored.
| Sync Type & Filter | Will [synchronize](#synced-settings) `Item Type` and `Selection Filter` for all buttons on this page with this setting enabled. |
| Selection         | Set how to select the item:<br><b>-Select by Nr</b>: Select an item using a number.<br><b>-Select by Name/Id</b>: Select an item using its name or id. |
| Order<br>(`Select by Nr`) | Sets how to order the items:<br><b>-Character Sheet</b>: Follow the order of the character sheet.<br><b>-Alphabetically</b>: Order items alphabetically.    |
| Nr<br>(`Select by Nr`)    | Number of the item to select. |
| Name/Id<br>(`Select by Name/Id`)  | Name or id of the item to select.  |
| On Press/On Hold  | Sets what to do when the button is pressed/held down:<br><b>-Do Nothing</b>: Do nothing.<br><b>-[Use](#use-item)</b>: Use (roll) the item.<br><b>-Equip</b>: Equip or unequip the item.<br><b>-Set Quantity</b>: Set the quantity of the item.<br><b>-Set Charges</b>: Set the charges of the item.    |
| Mode<br>(`Equip`)    | Configure what to do:<br><b>-Toggle</b>: Toggle between equipping and unequipping item.<br><b>-Equip</b>: Equip item.<br><b>-Unequip</b>: Unequip item.  |
| Mode<br>(`Set Quantity`) | Configure how to set the quantity:<br><b>-Set to Value</b>: Set to the specified value.<br><b>-Increase/Decrease</b>: Increase or decrease the quantity by the specified value. |
| Mode<br>(`Set Charges`) | Configure how to set the charges:<br><b>-Reset</b>: Reset the charges.<br><b>-Set to Value</b>: Set to the specified value.<br><b>-Increase/Decrease</b>: Increase or decrease the quantity by the specified value. |
| Display           | <b>-Icon</b>: Display item's icon.<br><b>-Name</b>: Display item's name.<br><b>-Box</b>: Display a box with data.<br><b>-Damage</b>: Display the item's damage formula.<br><b>-Range</b>: Display the item's range. |

### Use Item
Using the `On Press` or `On Hold` `Use Item` function, you can use the item by pressing/holding the button.

| Option            | Description   |
|-------------------|---------------|
| Roll Type         | Sets the roll type:<br><b>-Default</b>: Roll using the [default roll type](./otherActions.md#set-default-roll-type).<br><b>-Attack</b>: Perform an attack roll.<br><b>-Damage</b>: Perform a damage roll.<br><b>-Use</b>: Perform a 'use item' roll. |

## Features Mode
The features mode can be used to display and control token/actor features.

| Option            | Description   |
|-------------------|---------------|
| Features Type         | <b>-Any</b>: Select any kind of feature.<br><b>-Ability</b>: Select from abilities.<br><b>-Action</b>: Select from actions.<br><b>-Ancestry</b>: Select from ancestries.<br><b>-Edge</b>: Select from edges.<br><b>-Hindrance</b>: Select from hindrances.<br><b>-Power</b>: Select from powers.<br><b>-Skill</b>: Select from skills.<br><b>-[Set Type & Filter Sync](#synced-settings)</b>: Set the synced settings for this page. Will synchronize `Feature Type` and `Feature Type Filter`.<br><b>-[Offset](#offset)</b>: Set feature offsets. |
| Feature Type Filter  | Selects feature types to filter out:<br><b>-Power</b>: Filters powers.<br><b>-Skill</b>: Filters skills (useful if you are using skills via [Token Mode](#token-mode) instead).|
| Sync Type & Filter | Will [synchronize](#synced-settings) `Feature Type` and `Feature Type Filter` for all buttons on this page with this setting enabled. |
| Selection         | Set how to select the feature:<br><b>-Select by Nr</b>: Select a feature using a number.<br><b>-Select by Name/Id</b>: Select a feature using its name or id. |
| Order<br>(`Select by Nr`) | Sets how to order the features:<br><b>-Character Sheet</b>: Follow the order of the character sheet.<br><b>-Alphabetically</b>: Order features alphabetically.    |
| Nr<br>(`Select by Nr`)    | Number of the feature to select. |
| Name/Id<br>(`Select by Name/Id`)  | Name or id of the feature to select.  |
| Display           | <b>-Icon</b>: Display feature's icon.<br><b>-Name</b>: Display feature's name.|

## Effects Mode
The effects mode can be used to display and toggle token/actor effects.


| Option            | Description   |
|-------------------|---------------|
| Effect Type         | <b>-Any</b>: Select any kind of effect.<br><b>-Base</b>: Select "Base" type effects (most effects will be this type).<br><b>-Active Effect</b>: Select "Active Effect" type effects.<br><b>-Modifier</b>: Select "Modifier" type effects.<br><b>-[Set Type & Filter Sync](#synced-settings)</b>: Set the synced settings for this page. Will synchronize `Effect Type` and `Effect Type Filter`.<br><b>-[Offset](#offset)</b>: Set effect offsets. |
| Effect Type Filter  | Selects effect types to filter out:<br><b>-Temporary Effects</b>: Filters temporary effects.<br><b>-Permanent Effects</b>: Filters permanent effects.<br><b>-Status</b>: Filters status effects (useful if managing statuses via [Token Mode](#token-mode) instead).|
| Sync Type & Filter | Will [synchronize](#synced-settings) `Effect Type` and `Effect Type Filter` for all buttons on this page with this setting enabled. |
| Selection         | Set how to select the effect:<br><b>-Select by Nr</b>: Select an effect using a number.<br><b>-Select by Name/Id</b>: Select an effect using its name or id. |
| Order<br>(`Select by Nr`) | Sets how to order the effects:<br><b>-Character Sheet</b>: Follow the order of the character sheet.<br><b>-Alphabetically</b>: Order effects alphabetically.    |
| Nr<br>(`Select by Nr`)    | Number of the effect to select. |
| Name/Id<br>(`Select by Name/Id`)  | Name or id of the effect to select.  |
| Display           | <b>-Icon</b>: Display effect's icon.<br><b>-Name</b>: Display effect's name.<br><b>-Uses</b>: Display the effect's range. |

## Synced Settings
You can synchronize setting across multiple buttons on the same page, where a page is all the buttons that are currently visible on the device.<br>
If two buttons have `Sync Type & Filter` selected, and you change one of the filter settings on one, the otheer button will also be changed.

Each of the modes have a `Set Type & Filter Sync` setting. If you press this button, all buttons with `Sync Type & Filter` will have their settings changed to what you have configured for the `Set Type & Filter Sync` button.

## Offset
Offsets can be used in combination with the `Select by Nr` `Selection Mode`.<br>
By setting an offset, you increase `Nr` for all buttons with that offset.

For example, say you have 9 `Inventory Mode` buttons, with `Nr` set from 1 to 9.<br>
If you then set the offset to 9, it will display items 10 - 19.

| Option            | Description   |
|-------------------|---------------|
| Offset Mode       | Sets how to set the offset:<br><b>-Set to Value</b>: Sets the offset to the value set in `Offset`.<br><b>-Increase/Decrease</b>: Increases the offset by the value set in `Offset`. |
| Offset            | The value to set the offset to (in case of `Set to Value`), or the value to increment the offset with (in case of `Increase/Decrease`).<br> The offset can be any value, positive or negative. |
| Display           | <b>-Offset</b>: Display the current offset on the Stream Deck.<br><b>-Icon</b>: Display an icon on the Stream Deck. |
| Colors            | <b>-On Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is equal to the offset configured in `Offset`.<br><b>-Off Color</b>: (`Set to Value` only) A border is drawn on the Stream Deck of this color if the current offset is not equal to the offset configured in `Offset`.<br><b>-Background</b>: Background color of the button. |