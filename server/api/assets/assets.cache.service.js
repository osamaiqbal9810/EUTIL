class AssetsCacheService {
  constructor() {
    this.assetRetrievalCache = {};
  }

  async addAssetToCache(id, asset) {
    this.assetRetrievalCache[id] = { asset };
  }
  async removeFromCache(id) {
    delete this.assetRetrievalCache[id];
  }
  async resetCache() {
    this.assetRetrievalCache = {};
  }
  async getFromCache(id) {
    return this.assetRetrievalCache[id];
  }
}

export default AssetsCacheService;
