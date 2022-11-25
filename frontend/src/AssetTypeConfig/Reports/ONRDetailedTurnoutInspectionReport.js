export const switchTurnoutsIncluded = ["Switch", "Turnout 2", "Turnout 3", "Turnout 4"];

export const switchLhTypes = ["Switch", "Turnout 2", "Turnout 3", "Turnout 4"];
export const switchRhTypes = [];

export function switchFormCodeAllowed(formCode) {
  return switchFormCodes[formCode] ? switchFormCodes[formCode] : false;
}

const switchFormCodes = {
  onrTurnoutForm: true,
  onrRHTurnoutForm: true,
};
