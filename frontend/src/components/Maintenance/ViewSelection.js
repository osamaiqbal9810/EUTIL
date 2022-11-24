import { thList } from "react-icons-kit/fa/thList";
import { server } from "react-icons-kit/fa/server";
import { globe } from "react-icons-kit/fa/globe";
import { languageService } from "../../Language/language.service";

export const LIST_VIEW_SELECTION_TYPES = {
  LIST: "List",
  // MAP: "Map",
  GIS: "GIS",
};

export const LIST_VIEW_SELECTION = [
  {
    title: LIST_VIEW_SELECTION_TYPES.GIS,
    icon: globe,
    tooltip: {
      show: false,
      text: "GIS",
    },
  },
  // {
  //   title: LIST_VIEW_SELECTION_TYPES.MAP,
  //   icon: server,
  //   tooltip: {
  //     show: false,
  //     text: "Track Chart",
  //   },
  // },
  {
    title: LIST_VIEW_SELECTION_TYPES.LIST,
    icon: thList,
    tooltip: {
      show: false,
      text: "List",
    },
  },
];
