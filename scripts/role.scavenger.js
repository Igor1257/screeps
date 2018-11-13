var roleScavenger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var roleCommonWorker = require('role.common.worker');
        roleCommonWorker.isIll(creep);
        roleCommonWorker.isHarvest(creep);
	    
	    if(creep.memory.ill) 
	        roleCommonWorker.moveToClosestSpawn(creep) 
	    if(creep.memory.harvest && !creep.memory.ill)
            if(!roleCommonWorker.pickupResources(creep))
                roleCommonWorker.moveToClosestSpawn(creep);
        if(!creep.memory.harvest && !creep.memory.ill)
            roleCommonWorker.transferToSpawn(creep);
	}
};

module.exports = roleScavenger;