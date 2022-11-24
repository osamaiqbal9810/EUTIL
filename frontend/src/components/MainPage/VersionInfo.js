import eventBus from '../../utils/eventBus';
class VersionInfo {
  constructor(){
    const na = 'Not Available';
    this.loaded=false;
    this.versionInfo={webVersion: na, customer: na, applicationType: na, migration: na, database: na};
    this.appearance={displayName:"", logo1:"", logo2:""};
    this.featureset=[];
  }
  isLoaded(){
    return this.loaded;
    }
  isSITE(){
    return this.versionInfo.applicationType==="SITE";
    }
  isTIMPS(){
    return this.versionInfo.applicationType==="TIMPS";
    }
  isLAMP(){
      return this.versionInfo.applicationType==="LAMP";
    }
  setVersionInfo(versionInfo){
    this.versionInfo = versionInfo.versionInfo;
    this.featureset = versionInfo.featuresetList ? versionInfo.featuresetList : [];
    this.appearance = versionInfo.appearance ? versionInfo.appearance:{logo1:"", logo2:""};
    eventBus.dispatch('versionLoaded', this);
  }
  getApplicationType(){
    return this.versionInfo.applicationType;
  }
  getWebVersion(){
      return this.versionInfo.webVersion;
  }
  getCustomer(){
      return this.versionInfo.customer;
  }
  getMigration(){
      return this.versionInfo.migration;
  }
  getDatabase(){
      return this.versionInfo.database;
  }
  getFeatureset(id)
  {
    let featureset = this.featureset.find(f=>{return f.id===id;});
    return featureset;
  }
};

export const versionInfo = new VersionInfo();