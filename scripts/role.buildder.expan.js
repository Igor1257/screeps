var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var roleCommonWorker = require('role.common.worker');
        var roleRoom = require('role.room');
   
        if (creep.room.name != 'W26N23') {
            var target = new RoomPosition(1,7,'W26N23')
            creep.moveTo(target);
            console.log('bEx: going to W26N23 ' )
            return;
        }
        
	    if(!creep.memory.harvest && creep.carry.energy == 0) {
            creep.memory.harvest = true;
            creep.say('🔄 harvest');
	    }
	    
	    if(creep.memory.harvest && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.harvest = false;
	        creep.say('🚧 build');
	    }

	    if(!creep.memory.harvest) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var target = creep.pos.findClosestByRange(targets)
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        if (!roleRoom.isContainersEmpty(creep.room)) roleCommonWorker.withdrawContainers(creep);
	        else roleCommonWorker.harvestClosest(creep);
	    }
	}
};

module.exports = roleBuilder;
