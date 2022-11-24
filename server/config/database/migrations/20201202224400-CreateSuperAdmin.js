import { addIfNotExist} from "../dbFunctions/dbHelperMethods";
let UserGroup = require("../../../api/userGroup/userGroup.model");
let User = require("../../../api/user/user.model");
let AssetModel = require("../../../api/assets/assets.modal");

module.exports = {
    async up(){

    console.log('Update database: create new admin');
    
    let tenantId = "ps19";
    let username = "superadmin";
    let email = "superadmin@timps.com";
    let adminUG = await UserGroup.findOne({ isAdmin: true });
    if (!adminUG) {
        console.log("error: CreateSuperAdmin: UpdateScript: cannot find admin user group");
        return;
    }
    let location = await AssetModel.findOne({ parentAsset: null, assetType: "Company" });
    if (!location)
    {
        console.log("error: CreateSuperAdmin: UpdateScript: cannot find company asset");
    }
    let usr=
        {
        name: username,
        tenantId: tenantId,
        email: email,
        hashedPassword: "$2a$10$d4IcrUtbTJuKDESzltG.tuFOAJpEokIKqc/86ClUK6z9jl5dy73iG",
        isAdmin: true,
        userGroup: adminUG._id,
        group_id: adminUG.group_id,
        genericEmail: "superadmin2@timps.com",
        department: "administration",
        mobile: "+1455555645",
        assignedLocation: location && location._id ? location._id:null,
        assignedLocationName: location && location.unitId ? location.unitId: ''
        };
    
        await addIfNotExist(User, { name: username, email: email }, usr);
    }
};