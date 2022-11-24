import { words } from "./Dictionery";
import { dnyamicLangWords } from "./DynamicLanguage";
// import moment from 'moment';
export function languageService(word) {
  let lang = localStorage.getItem("language") ? localStorage.getItem("language") : "en";
  // moment.locale(lang);
  return dnyamicLangWords[word] ? dnyamicLangWords[word][lang] : words[word] ? (words[word][lang] ? words[word][lang] : word) : word;
}

export function getLanguageLocal() {
  return localStorage.getItem("language") ? localStorage.getItem("language") : "en";
}
