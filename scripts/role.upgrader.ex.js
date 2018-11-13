var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var roleCommonWorker = require('role.common.worker');
        
        if (creep.room.name != 'W26N23') {
            var target = new RoomPosition(1,7,'W26N23')
            creep.moveTo(target);
            console.log('bEx: going to W26N23 ' )
            return;
        }
        
        
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
        else roleCommonWorker.harvestClosest(creep);
	}
};

module.exports = roleUpgrader;