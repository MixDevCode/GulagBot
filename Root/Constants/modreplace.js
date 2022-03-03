const modEnum = require('../Functions/mods_enum.js')
module.exports = (modnumber) => {
    var modsinfo = modEnum({mod: modnumber}).mod_text;
    var modsinfonum = modnumber;
    if(modsinfo.includes("HD")){ modsinfonum = modsinfonum-8 };
    if(modsinfo.includes("NC")){ modsinfonum = modsinfonum-512 };
    if(modsinfo.includes("NF")){ modsinfonum = modsinfonum-1 };
    if(modsinfo.includes("PF")){ modsinfonum = modsinfonum-16384 };
    if(modsinfo.includes("SD")){ modsinfonum = modsinfonum-32 };
    if(modsinfo.includes("MR")){ modsinfonum = modsinfonum-1073741824 };
    if(modsinfo.includes("V2")){ modsinfonum = modsinfonum-536870912 };
    if(modsinfo.includes("RX")){ modsinfonum = modsinfonum-128 };
	if(modsinfo.includes("AP")){ modsinfonum = modsinfonum-8192 };
    
    return modsinfonum;
}