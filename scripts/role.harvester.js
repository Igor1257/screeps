function getTargetsForFeeding(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
    });
            
    if (targets.length == 0){
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
    }
            
    if (targets.length == 0){
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER)
            }
        });
    }
            
    if (targets.length == 0){
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE)
            }
        });
    }
    return targets;
};


var roleHarvester = {
    
   
    /** @param {Creep} creep **/
    run: function(creep) {
        var roleCommonWorker = require('role.common.worker');
        
        var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
	    if(hostileCreeps.length>0) creep.memory.roomatacked = true;
	    else creep.memory.roomatacked = false;

        roleCommonWorker.isIll(creep);
        if(creep.memory.ill) {
            roleCommonWorker.moveToClosestSpawn(creep) 
            return;
        }
	        
	   roleCommonWorker.isHarvest(creep); 
	    if(creep.memory.harvest) {
	         var pickupResult = roleCommonWorker.pickupResources(creep);
	         if (!pickupResult)
	            roleCommonWorker.harvestClosest(creep)
	    }
	       
        else {
            if (creep.memory.roomatacked){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                var targets = getTargetsForFeeding(creep);
                if(targets.length > 0) {
                    var target = creep.pos.findClosestByRange(targets);
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else{
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
        }
	}
};

module.exports = roleHarvester;