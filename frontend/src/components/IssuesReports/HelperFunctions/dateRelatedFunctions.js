/* eslint eqeqeq: 0 */
import { languageService } from "../../../Language/language.service";

export const setActiveStateOfFixedDatesFilter = (filters, dateFilterName) => {
  filters &&
    filters.forEach(element => {
      if (languageService(element.text) == dateFilterName) {
        element.state = true;
      } else {
        element.state = false;
      }
    });
};
