# rm-challenge-events
JavaScript functions used to support game created in Lectora, an eLearning authoring tool.

JSCode randomly selects a scenario that Lecotra presents to player, details of scenario are stored in an array.
Player Accepts or Rejects scenario.
If Rejects, game presents another scenario.
If Accepts, JSCode determines if requirements of scenario can be met - start day, number of days, and number of rooms/spaces.
If scenario can be met, values are loaded in variables that are accessed and displayed by Lectora.
If scenario cannot be met, appropriate message is displayed by JSCode.
Play continues until scenarios have been selected and presented.
