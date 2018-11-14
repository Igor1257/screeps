var creepBase = function(creep){
    this.creep = creep;
    this.isContainersEmpty = function(limit=100){
        var containers = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > limit)
                    }});
        console.log('containers: ' + containers)
        if (containers.length > 0) return false;
        else return true;
    };
    this.isIll = function(){
        if (Game.time%10 == 0) console.log(this.creep.ticksToLive);
        if (this.creep.ticksToLive < 100) this.creep.memory.ill = true;
        if (this.creep.ticksToLive >= CREEP_LIFE_TIME - 100) this.creep.memory.ill = false;
    };
    this.isHarvest = function(){
        if(!this.creep.memory.harvest && this.creep.carry.energy == 0) {
            this.creep.memory.harvest = true;
	    }
	    if(this.creep.memory.harvest && this.creep.carry.energy == this.creep.carryCapacity) {
	        this.creep.memory.harvest = false;
	    }
    };
    this.getEnergySource = function(){
        let sourcesMatrix = [];
        for (let name in this.creep.room.memory.sources){
            let energySource = {
                source : null,
                pathCost: null,
                energyAvaible: null,
                priority: null,
                value: null
            }
            energySource.source = this.creep.room.memory.sources[name];
            energySource.pathCost = PathFinder.search(
                this.creep.pos,
                this.creep.room.memory.sources[name].pos,                         
                ).cost;
        
        Memory.DEBUG = energySource;
        }
        //получить список источников энергии
        //оценить расстояние до них 
        //оценить запас энергии в них
        //оценить время жизни источника (упавшие ресурсы исчезают)
        //выбрать оптимальный и вернуть его
        return null;
    }
    this.getEnergy = function(){
        if (Game.time%10 == 0){this.getEnergySource()};
        if (this.pickupResources()) {
            //console.log('pickup');
            return;
        }
        if (!this.isContainersEmpty()){
            //console.log('container');
            this.withdrawContainers();
            return;
        }
        //console.log('source')
	    this.harvestClosest();
    }
    this.moveToClosestSpawn = function(){
        var spawns = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }});
        
        var spawn = this.creep.pos.findClosestByRange(spawns);
        this.creep.moveTo(spawn);
    };
    this.pickupResources = function(){
        var dropped_energies = this.creep.room.memory.dropped_resources;
        if ((dropped_energies.length > 0) && (this.creep.carry.energy < this.creep.carryCapacity)){   
            //console.log('dropped energies ' + dropped_energies)
            //console.log('creep:' + this.creep.id + '  carry energy: ' + this.creep.carry.energy + '  carry power: ' + this.creep.carry.power + '  capacity: ' + this.creep.carryCapacity)
            var target = this.creep.pos.findClosestByRange(dropped_energies)
            if(this.creep.pickup(target) == ERR_NOT_IN_RANGE){
                //this.creep.say('pickup');
                this.creep.moveTo(target, {visualizePathStyle: {stroke: '##fff311'}});    
                return true;
            }
        }
        return false;
    };
    this.pickupDroppedResources = function(){
        var dropped_energies = this.creep.room.find(FIND_DROPPED_RESOURCES);
        if (dropped_energies.length > 0)
            if(this.creep.pickup(dropped_energies[0]) == ERR_NOT_IN_RANGE) 
                this.creep.moveTo(dropped_energies[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
            
    };
    this.harvestClosest = function(){
        var sources = this.creep.room.find(FIND_SOURCES);
	    var target = this.creep.pos.findClosestByRange(sources)
        if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };
    this.harvestDefined = function(index){
        var sources = this.creep.room.find(FIND_SOURCES);
	    var target = sources[index];
        if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };
    this.harvestTarget = function(target){
        if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };
    this.withdrawLink = function(index){
        var links = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK)
                    }});
        if(this.creep.withdraw(links[index],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                this.creep.moveTo(links[index], {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.withdrawStorage = function(){
        var links = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)
                    }});
        if(this.creep.withdraw(links[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                this.creep.moveTo(links[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.withdrawContainers = function(limit=100){
        var targets = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > limit)
                    }});
        var target = this.creep.pos.findClosestByRange(targets);
        if(this.creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});    
    };
    this.transferToStorage = function(){
        targets = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)
                    }
                });
        if(targets.length > 0) {
            var target = this.creep.pos.findClosestByRange(targets);
            if(this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else this.creep.say('LOST');
    };
    this.transferToSpawn = function(){
        targets = this.creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }
                });
        if(targets.length > 0) {
            var target = this.creep.pos.findClosestByRange(targets);
            if(this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, {reusePath:10}, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else this.creep.say('LOST');
    }
}

module.exports = creepBase;
