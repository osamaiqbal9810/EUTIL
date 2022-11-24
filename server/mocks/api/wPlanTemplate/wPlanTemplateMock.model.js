class wPlanTemplateApiModelMock {
  constructor() {
    this.data = null;

    this.sortedData = null;
  }

  setData(data) {
    this.data = data;
  }
  setSortedData(sortedData) {
    this.sortedData = sortedData;
  }
  sort(sortCriteria) {
    return this;
  }

  find(obj, sortCallBack) {
    return this;
  }
  async exec(obj, sortCallBack) {
    return this.sortedData;
  }
}

export default wPlanTemplateApiModelMock;
