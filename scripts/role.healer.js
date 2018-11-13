var roleHealer = {
    
    
    run: function(creep){
        var roleCommonWorker = require('role.common.worker');
        
        
        if(!creep.memory.harvest && creep.carry.energy < 2 ) {
            creep.memory.harvest = true;
            creep.say('harvest');
        }
        
        if(creep.memory.harvest && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvest = false;
            creep.say('heal');
        }
        
        if (creep.memory.harvest){
            roleCommonWorker.harvestClosest(creep);
        }
        
         if(!creep.memory.harvest) {
            // var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax)});
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (s) => ((s.hits < s.hitsMax) && (s.structureType == STRUCTURE_ROAD /*|| s.structureType == STRUCTURE_CONTAINER*/))});
            if (targets.length == 0)
                targets = creep.room.find(FIND_STRUCTURES, {filter: (s) => ((s.hits < s.hitsMax) && (s.structureType == STRUCTURE_CONTAINER /*|| s.structureType == STRUCTURE_CONTAINER*/))});
            console.log('healerTargets: ' + targets)
            if (targets.length){
                var trg = creep.pos.findClosestByRange(targets);
                if(creep.repair(trg) == ERR_NOT_IN_RANGE){
                    creep.moveTo(trg, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
            else {
                creep.moveTo(creep.room.find(FIND_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_SPAWN})[0])
            }
        }
    }
}
module.exports = roleHealer;