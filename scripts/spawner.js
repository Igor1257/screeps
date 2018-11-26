var spawner = function(spawn){
    this.spawn = spawn;
    this.creepsInCurrentRoom = 0;
    this.room = '';
    this.creepTypes = {
            baseharvester : {
                limit: 1,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'harvester',
                role: 'harvester'
            },
            harvester : {
                limit: 1,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'harvester',
                role: 'harvester'
            },
            upgrader : {
                limit: 2,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'upgrader',
                role: 'upgrader'
            },
            builder : {
                limit: 0,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'builder',
                role: 'builder'
            },
            healer : {
                limit: 0,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'healer',
                role: 'healer'
            },
            scavenger: {
                limit: 0,
                exist: 0,
                body: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY],
                namePrevix: 'scavenger',
                role: 'scavenger'
            },
            miner: {
                limit: 1, // используй isMinerRequired()
                exist: 0,
                body: [WORK,WORK,MOVE,MOVE],
                namePrevix: 'miner',
                role: 'miner',
                //target: ''
            },
        }
    this.cleanMemory = function(){
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('spawner - Clearing non-existing creep memory:', name);
            }
        }
    };
    this.countCreeps = function(){
        for(var typeName in this.creepTypes) this.creepTypes[typeName].exist = 0;
        for(var typeName in this.creepTypes)
            for (var name in Game.creeps)
                if (Game.creeps[name].memory.role == this.creepTypes[typeName].role && Game.creeps[name].room.name == this.room.name)
                {
                    this.creepTypes[typeName].exist += 1;
                    this.creepsInCurrentRoom += 1;
                    //console.log(typeName + ' ' + this.creepTypes[typeName].exist )
                }
    }; 
    this.isMinerRequired = function(){
        //console.log(this.creepTypes.miner.exist)
        //console.log(this.room.memory.sources.length)
        if (this.creepTypes.miner.exist < this.room.memory.sources.length) return true;
        else return false;
    }
    this.isHarvesterRequired = function(){
        console.log('harvesters exist: ' + this.creepTypes['harvester'].exist);
        console.log('harvesters limit: ' + this.creepTypes['harvester'].limit);
        if (this.creepTypes['harvester'].exist < this.creepTypes['harvester'].limit) return true;
        else return false;
    }
    this.isBaseHarvesterRequired = function(){
        console.log('creeps in room: ' + this.creepsInCurrentRoom);
        if (this.creepsInCurrentRoom == 0) return true;
        else return false;
    }
    this.recycleCreep = function(){
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.ill && creep.room.name == this.room.name)  {
                var result = this.spawn.recycleCreep(Game.creeps[name]);
                console.log('recycle creep ' + name + ':' + result);
            }
        }
    }
    this.renewCreepSimple = function(){
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.ill && creep.room.name == this.room.name)  {
                var result = this.spawn.renewCreep(Game.creeps[name]);
                console.log('renew creep ' + name + ':' + result);
            }
        }
    }
    this.renewCreep = function(){
        this.recycleCreep();
        //добавить проверку на соответствие боди крипа с текущим боди для данного типа крипов, если ок ренью иначе рецикл
    };
    this.report = function(){
        console.log(this.room.name, " ", this.spawn.name )
        console.log(this.room.name + '.energyAvailable ' + this.room.energyAvailable)
        console.log(this.room.name + '.energyCapacityAvailable ' + this.room.energyCapacityAvailable)
    }
    this.spawnCreeps = function(){
        for(var typeName in this.creepTypes){
            var cr = this.creepTypes[typeName];
            if (cr.exist < cr.limit){
                this.spawnCreep(cr,{harvest:true, role:cr.role});
            } 
        }
    };
    this.spawnCreep = function(creep, options={}){
        if (this.spawn.spawning) return;
        var result = this.spawn.spawnCreep(
                creep.body, 
                creep.namePrevix + Game.time, 
                {memory: options, 
                dryRun: true});
        console.log('check spawn result: ' + creep.namePrevix + ' - '  + result);
        
        if (result == 0){
            result = this.spawn.spawnCreep(
                creep.body, 
                creep.namePrevix + Game.time, 
                {memory: options, 
                dryRun: false});
            console.log('spawn result: ' + creep.namePrevix + ' - '  + result);
        } 
    };
    this.getFreeSource = function(){
        
    }
    this.spawnCreepMiner = function(){
        // все минеры получили таргет при рождении
        // минер создается, если количество источников больше количества минеров
        // взять источник и найти его среди таргетов минеров, если не найден назначить новому минеру
        console.log('spawnCreepMiner')
        console.log(this.room.memory.sources[0])
        var roomname = this.room.name;
        for (var source in this.room.memory.sources){
            var sourceId = this.room.memory.sources[source].id;
            var miners = _.filter(Game.creeps, 
                function(o){return (
                    o.memory.role=='miner' &&  
                    o.room.name == roomname && 
                    o.memory.target.id == sourceId)});
            console.log('source id = ' + sourceId + ' assigned miners: ' + miners)
            if (miners.length == 0){
                this.spawnCreep(this.creepTypes['miner'],{role:'miner', harvest:true, target: this.room.memory.sources[source]})
            }
        }
        
        
        var miners = _.filter(Game.creeps, 
            function(o){return (o.memory.role=='miner' &&  o.room.name == roomname)})
        console.log('all miners:' + miners)
        //
    }
    this.run = function() {
        this.room = this.spawn.room;
        if (Game.time % 10 == 0) this.report();
        this.cleanMemory();
        this.countCreeps();
        if (this.isBaseHarvesterRequired) this.spawnCreep(this.creepTypes['baseharvester'],{role:'harvester', harvest:true});
        if (this.isHarvesterRequired()) this.spawnCreep(this.creepTypes['harvester'],{role:'harvester', harvest:true});
        else {
            if (this.isMinerRequired()) this.spawnCreepMiner();
            else this.spawnCreeps();
        }
        this.renewCreep();
    };
}
module.exports = spawner;
