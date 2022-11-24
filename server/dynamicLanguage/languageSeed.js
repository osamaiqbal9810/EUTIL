let ServiceLocator = require("../framework/servicelocator");
import _ from "lodash";
export async function dynamicLanguageToDB() {
  let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
  try {
    let listEnglish = await ApplicationLookupsModel.findOne({ listName: "DynamicLanguage_en" });
    if (!listEnglish) {
      let newLanguageList = {
        tenantId: "ps19",
        listName: "DynamicLanguage_en",
        code: "lang-01",
        opt1: filterLangFunc("en"),
      };
      let createdList = await new ApplicationLookupsModel(newLanguageList).save();
      console.log("Language List Engligh Created");
    } else if (Object.keys(listEnglish.opt1).length < Object.keys(dynamicLanguage).length) {
      console.log('updating list english language')
      listEnglish.opt1 = filterLangFunc('en');
      await listEnglish.save();
    }

    let listSpanish = await ApplicationLookupsModel.findOne({ listName: "DynamicLanguage_es" });
    if (!listSpanish) {
      let newLanguageList = {
        tenantId: "ps19",
        listName: "DynamicLanguage_es",
        code: "lang-02",
        opt1: filterLangFunc("es"),
      };
      let createdList = await new ApplicationLookupsModel(newLanguageList).save();
      console.log("Language List Spanish Created");
    } else if (Object.keys(listSpanish.opt1).length < Object.keys(dynamicLanguage).length) {
      console.log('updating list Spanish language')
      listSpanish.opt1 = filterLangFunc('es');
      await listSpanish.save();
    }

    let listFrench = await ApplicationLookupsModel.findOne({ listName: "DynamicLanguage_fr" });

    if (!listFrench) {
      let newLanguageList = {
        tenantId: "ps19",
        listName: "DynamicLanguage_fr",
        code: "lang-03",
        opt1: filterLangFunc("fr"),
      };
      let createdList = await new ApplicationLookupsModel(newLanguageList).save();
      console.log("Language List French Created");
    } else if (Object.keys(listFrench.opt1).length < Object.keys(dynamicLanguage).length) {
      console.log('updating list French language')
      listFrench.opt1 = filterLangFunc('fr');
      await listFrench.save();
    }
  } catch (error) {
    console.log("languageSeed :", error);
  }
}

const dynamicLanguage = {
  rail: { en: "Rail", es: "Carril", fr: 'Rail' },
  "3rd Rail": { en: "3rd Rail", es: "3er carril", fr: '3e rail' },
  switch: { en: "Switch", es: "cambiar", fr: 'Commutateur' },
  ties: { en: "Ties", es: "Corbatas", fr: 'Liens' },
  line: { en: "Line", es: "Línea", fr: 'Ligne' },
  track: { en: "Track", es: "Pista", fr: 'Piste' },
  Station: { en: "Station", es: "Estación", fr: 'Station' },
  trackType: { en: "Track Type", es: "tipo de pista ", fr: 'Type de piste' },
  section: { en: "Section", es: "sección", fr: 'Section' },
  heMethod: { en: "heMethod", es: "heMethod", fr: 'heMethod' }, // SPANISH OR NOT OT BE SPANISH
  switchType: { en: "Switch Type", es: "Switch Type", fr: 'Type de commutateur' }, // SPANISH OR NOT OT BE SPANISH
  switchingMethod: { en: "Switching Method", es: "Switching Method", fr: 'Méthode de commutation' }, // SPANISH OR NOT OT BE SPANISH
  subsection: { en: "Subsection", es: "Subsection", fr: 'Sous-section' }, // SPANISH OR NOT OT BE SPANISH
  interlocking: { en: "Interlocking", es: "Enclavamiento", fr: 'Verrouillage' },
  bridge: { en: "Bridge", es: "Puente", fr: 'Pont' },
  Bridge: { en: "Bridge", es: "Puente", fr: 'Pont' },
  crossing: { en: "Crossing", es: "Cruce", fr: 'Traversée' },
  Crossing: { en: "Crossing", es: "Cruce", fr: 'Traversée' },
  yard: { en: "Yard", es: "Yarda", fr: 'Cour' },
  derail: { en: "Derail", es: "Hacer descarrilar", fr: 'Dérailler' },
  Derail: { en: "Derail", es: "Hacer descarrilar", fr: 'Dérailler' },
  intermediate: { en: "Intermediate", es: "Intermedio", fr: 'Intermédiaire' },
  Intermediate: { en: "Intermediate", es: "Intermedio", fr: 'Intermédiaire' },
  "Dragging equipment detector": { en: "Dragging equipment detector", es: "Detector de equipos de arrastre", fr: "Détecteur d'équipement traînant" },
  "Wheel impact load detector": { en: "Wheel impact load detector", es: "Detector de carga de impacto de rueda", fr: "Détecteur de charge d'impact de roue" },
  Repeater: { en: "Repeater", es: "Reloj de repetición", fr: 'Repeater' },
  "Weather Station": { en: "Weather Station", es: "Estación meteorológica", fr: 'Station météo' },
  "Accoustic bearing detector": { en: "Accoustic bearing detector", es: "Detector de cojinetes acústicos", fr: 'Détecteur de palier acoustique' },
  "Wheel profile": { en: "Wheel profile", es: "Perfil de rueda", fr: 'Profil de roue' },
  "T-bogie/ bogies geometry": { en: "T-bogie/ bogies geometry", es: "Geometría T-bogie", fr: 'Géométrie des bogies en T' },
  "Land slide detector": { en: "Land slide detector", es: "Detector de deslizamientos de tierra", fr: 'Détecteur de glissement de terrain' },
  "Control Point": { en: "Control Point", es: "Punto de control", fr: 'Point de contrôle' },
  "Signal": { en: "Signal", es: "Señal", fr: 'Signal' },
  "Sub-Division": { en: "Sub-Division", es: "Subdivisión", fr: 'Subdivision' },
  "Interlocking": { en: "Interlocking", es: "Enclavamiento", fr: 'Verrouillage' },
  "Hot Box detector": { en: "Hot Box detector", es: "Detector de caja caliente", fr: 'Détecteur de boîte chaude' },
  "Hot wheel detector": { en: "Hot wheel detector", es: "Detector de rueda caliente", fr: 'Détecteur de roue chaude' },
  "Yard Track": { en: "Yard Track", es: "Pista de patio", fr: 'Piste de cour' },
  Frog: { en: "Frog", es: "Rana", fr: 'Grenouille' },
};

function filterLangFunc(keyToAdd) {
  let updatedLang = _.cloneDeep(dynamicLanguage);
  let result = {};
  let enKeys = Object.keys(updatedLang);
  for (let key of enKeys) {
    result = { ...result, [key]: { [keyToAdd]: updatedLang[key][keyToAdd] } }
  }
  return result;
}
