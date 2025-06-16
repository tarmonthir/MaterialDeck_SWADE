# Other Actions

A new function is added to 'Other Actions':

* [Set Default Roll Type](#set-default-roll-type)

## Set Default Roll Type
Using this function you can change the 'default roll type'.<br>
This roll type is applied to rolls in the [Token Action](./token.md) if their `Roll Type` is set to `Default`.<br>

### Type
You can configure a button to set the type to:

* <b>Default</b>: Perform a default roll
* <b>Attack</b>: Perform an attack roll - weapons only
* <b>Damage</b>: Perform a damage roll - weapons only
* <b>Use</b>: Use the item by putting it into chat.

Say you have a 'Token Action' button set to:

* `Mode`: `Inventory`
* Selection options: Set to select a weapon
* `On Press`: `Use`
* `Show Dialog`: `False`
* `Roll Type`: `Default`

If you then press a 'Set Default Roll Type' button set to `Attack` and then press the 'Token Action' button, an attack roll will be performed for the weapon.<br>
Similarly, if you have the 'Set Default Roll Type' button set to `Damage` the roll will be a damage roll.

If the item you attempt to roll for is not able to perform a roll of the specified type, it will perform a default roll.

### Set After Use To
With this setting you can configure what the default roll type should be set to after performing a roll.<br>
For example, you might want it to always default to damage rolls, so you set it to `Attack`.<br>
If you have multiple 'Set Default Roll Modifier' buttons on the display, their `Set After Use To` setting will be the same for all.

`Set After Use To` is only applied when something is rolled that actually uses the default roll type.