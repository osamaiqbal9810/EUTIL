import { getServerEndpoint } from "../../utils/serverEndpoint";

class LocationPrefixSerice {
  constructor() {
    this.prefixList = null;
  }
  async getPrefixList() {
    let token = localStorage.getItem("access_token") || null;
    try {
      let response = await fetch(getServerEndpoint() + "api/applicationlookups/getlist/LocationPrefix", {
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: token },
        method: "GET",
      });
      if (response.status >= 200 && response.status < 300) {
        let parsedRes = await response.text();
        this.prefixList = JSON.parse(parsedRes);
        return this.prefixList;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return false;
  }

  getPrefixMp(milepost, locId) {
    if (!this.prefixList) this.getPrefixList();
    let mp = parseFloat(milepost);
    if (isNaN(mp)) return "";
    let item = this.prefixList && this.prefixList.find((loc) => loc.code === locId);
    if (item) {
      let range = item.opt2.find((r) => r.start <= mp && r.end >= mp);
      if (range) return range.prefix + " ";
    }
    return "";
  }
}

export const LocPrefixService = new LocationPrefixSerice();
