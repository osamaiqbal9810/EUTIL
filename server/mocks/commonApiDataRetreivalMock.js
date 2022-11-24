class CommonApiModelMock {
  constructor() {
    this.data = null;
  }

  setData(data) {
    this.data = data;
  }

  async find(obj) {
    return this.data;
  }
}

export default CommonApiModelMock;
