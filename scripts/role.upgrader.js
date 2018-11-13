var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var roleCommonWorker = require('role.common.worker');
        
        roleCommonWorker.isIll(creep);
        if(creep.memory.ill) {
            roleCommonWorker.moveToClosestSpawn(creep) 
            return;
        }
	        
	    roleCommonWorker.isHarvest(creep); 
	    
	    if(!creep.memory.harvest) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else{
            roleCommonWorker.pickupResources(creep);
        } 
       
	}
};

module.exports = roleUpgrader;