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
        // составляется список всех источников энергии в комнате
        let sourcesMatrix = [];
        // energy sources
        for (let name in this.creep.room.memory.sources){
            let energySource = {
                source : null,
                type : 'source',
                value: null
            }
            energySource.source = this.creep.room.memory.sources[name];
            energySource.value  = this.getSourceValue(this.creep.room.memory.sources[name]);
            sourcesMatrix.push(energySource);
        }
        //containers
        for (let name in this.creep.room.memory.containers){
             let energySource = {
                source : null,
                type : 'container',
                value: null
            }
            energySource.source =  this.creep.room.memory.containers[name];
            energySource.value  = this.getContainerValue(this.creep.room.memory.containers[name]);
            sourcesMatrix.push(energySource);
        };
        //droppedEnergyResourceValue
        for (let name in this.creep.room.memory.dropped_resources){
             let energySource = {
                source : null,
                type: 'dropped_energy',
                value: null
            }
            energySource.source =  this.creep.room.memory.dropped_resources[name];
            energySource.value  = this.getDroppedEnergyValue(this.creep.room.memory.dropped_resources[name]);
            sourcesMatrix.push(energySource);
        };
        //storages
        for (let name in this.creep.room.memory.storage){
             let energySource = {
                source : null,
                type: 'storage',
                value: null
            }
            energySource.source =  this.creep.room.memory.storage[name];
            energySource.value  = this.getStorageValue(this.creep.room.memory.storage[name]);
            sourcesMatrix.push(energySource);
        };

        Memory.DEBUG = sourcesMatrix;
        let result = {value : 0, name : null};
        for (let name in sourcesMatrix){
            if (sourcesMatrix[name].value > result.value){
                result.name = name;
            }
        }
        console.log('result.name: ' + result.name)
        console.log('sourcesMatrix item: ' + sourcesMatrix[result.name])
        return sourcesMatrix[result.name];
    }
    this.getStorageValue = function(storage){
        let value = 0;
        return value;
    }
    this.getDroppedEnergyValue = function(dropped_resource){
        let value = 3;
        return value;
    }
    this.getContainerValue = function(controller){
        let value = 2;
        return value;
    }
    this.getSourceValue = function(){
        let value = 1;
        return value;
        /*energySource.pathCost = PathFinder.search(
                this.creep.pos,
                this.creep.room.memory.sources[name].pos,                         
                ).cost;
            energySource.energyAvaible = this.creep.room.memory.sources[name].energy;
            */
            
    }
    this.getEnergy = function(){
        this.getEnergyFromSource();
    }
    this.getEnergyFromSource = function(){
        //console.log('getEnergyFromSource');
        this.creep.memory.source = this.getEnergySource(); 
        let currentSource = this.creep.memory.source;
        if (currentSource.type == 'dropped_energy') this.pickupResource(currentSource.source);
        if (currentSource.type == 'source') this.harvestTarget(currentSource.source);
        if (currentSource.type == 'storage') this.withdrawStorage(currentSource.source);
    }
    this.pickupResource = function(target){
        if(this.creep.pickup(target) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(target, {visualizePathStyle: {stroke: '##fff311'}});
        }
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
        //console.log('harvest target');
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
    this.withdrawStorage = function(target){
        console.log(target.pos + ' ' + target.room.name)
        if(this.creep.withdraw(target) == ERR_NOT_IN_RANGE) 
                this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});    
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
