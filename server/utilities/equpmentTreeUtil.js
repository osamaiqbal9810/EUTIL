export function fetchEquipByField(field, value, equipmentArray) {
  let node = null;
  equipmentRecursion(node, field, value, equipmentArray);
  return node;
}

function equipmentRecursion(node, field, value, equipmentArray) {
  for (let equipment of equipmentArray) {
    if (equipment[field] === value) {
      node = equipment;
      break;
    } else {
      if (equipment.equipments) {
        equipmentRecursion(node, field, value, equipment.equipments);
      }
    }
  }
}

export function getFlatEquipments(equipmentArray, field = "id") {
  let hashMap = {};
  hashmapRecursion(equipmentArray, field, hashMap);
  return hashMap;
}

function hashmapRecursion(equipmentArray, field, hashMap) {
  for (let equip of equipmentArray) {
    hashMap[equip[field]] = equip;
    if (equip.equipments) {
      hashmapRecursion(equip.equipments, field, hashMap);
    }
  }
}
