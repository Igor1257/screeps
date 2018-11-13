var creepBase = function(creep){
    this.isIll = function(){
        if (Game.time%10 == 0) console.log(creep.ticksToLive);
        if (creep.ticksToLive < 100) creep.memory.ill = true;
        if (creep.ticksToLive >= CREEP_LIFE_TIME - 100) creep.memory.ill = false;
    };
    this.isHarvest = function(){
        if(!creep.memory.harvest && creep.carry.energy == 0) {
            creep.memory.harvest = true;
	    }
	    if(creep.memory.harvest && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.harvest = false;
	    }
    };
    this.moveToClosestSpawn = function(){
        var spawns = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }});
        
        var spawn = creep.pos.findClosestByRange(spawns);
        creep.moveTo(spawn);
    };
    this.pickupResources = function(){
        var dropped_energies = creep.room.find(FIND_DROPPED_RESOURCES);
        if ((dropped_energies.length > 0) && (creep.carry.energy < creep.carryCapacity)){   
            console.log('dropped energies ' + dropped_energies)
            console.log('creep:' + creep.id + '  carry energy: ' + creep.carry.energy + '  carry power: ' + creep.carry.power + '  capacity: ' + creep.carryCapacity)
            if(creep.pickup(dropped_energies[0]) == ERR_NOT_IN_RANGE){
                creep.say('I\'ll get!');
                creep.moveTo(dropped_energies[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
                return true;
            }
        }
        return false;
    };
    this.pickupDroppedResources = function(){
        var dropped_energies = creep.room.find(FIND_DROPPED_RESOURCES);
        if (dropped_energies.length > 0)
            if(creep.pickup(dropped_energies[0]) == ERR_NOT_IN_RANGE) 
                creep.moveTo(dropped_energies[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
            
    };
    this.harvestClosest = function(){
        var sources = creep.room.find(FIND_SOURCES);
	    var target = creep.pos.findClosestByRange(sources)
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };
    this.harvestDefined = function(index){
        var sources = creep.room.find(FIND_SOURCES);
	    var target = sources[index];
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };
    this.withdrawLink = function(index){
        var links = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK)
                    }});
        if(creep.withdraw(links[index],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(links[index], {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.withdrawStorage = function(){
        var links = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)
                    }});
        if(creep.withdraw(links[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(links[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.withdrawContainers = function(){
        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)
                    }});
        var target = creep.pos.findClosestByRange(targets);
        if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.transferToStorage = function(){
        targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)
                    }
                });
        if(targets.length > 0) {
            var target = creep.pos.findClosestByRange(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else creep.say('LOST');
    };
    this.transferToSpawn = function(){
        targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }
                });
        if(targets.length > 0) {
            var target = creep.pos.findClosestByRange(targets);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else creep.say('LOST');
    }
}

module.exports = creepBase;

   