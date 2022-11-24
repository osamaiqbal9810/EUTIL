import { globe } from "react-icons-kit/fa/globe";

import { ic_view_list } from "react-icons-kit/md/ic_view_list";
import { languageService } from "../../Language/language.service";

export const LIST_VIEW_SELECTION_TYPES = {
  GIS: "GIS",
  AssetsView: "AssetsView",
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
  {
    title: LIST_VIEW_SELECTION_TYPES.AssetsView,
    icon: ic_view_list,
    tooltip: {
      show: false,
      text: `${languageService('Assets List View')}`,
    },
  },
];
