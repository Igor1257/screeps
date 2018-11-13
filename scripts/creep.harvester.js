var creepBase = require('creep.base');
var creepHarvester = function(creep){
    this.creep = creep;
    this.getTargetsForFeeding = function(){
        //console.log('getTargetsForFeeding')
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
    this.run = function(){
        this.isIll();
        if(this.creep.memory.ill) {
            this.moveToClosestSpawn() 
            return;
        }
	    this.isHarvest();
	    if(this.creep.memory.harvest) {
	         this.getEnergy();
	    }
	    else{
	        var targets = this.getTargetsForFeeding();
            if(targets.length > 0) {
                var target = this.creep.pos.findClosestByRange(targets);
                if(this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});                    
                }
            }
            else{
                this.moveToClosestSpawn();
            }
	    }
	    
    }
}

creepHarvester.prototype = new creepBase(this.creep);
module.exports = creepHarvester;
