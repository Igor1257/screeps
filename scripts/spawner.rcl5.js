function cleanMemory(){
    for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('spawner - Clearing non-existing creep memory:', name);
            }
        }
}

function renewCreep(room){
    
    for(var name in Game.creeps) {
        if (Game.creeps[name].memory.ill)  {
            var result = Game.spawns['Spawn1'].renewCreep(Game.creeps[name]);
            console.log('ranew creep ' + name + ':' + result);
        }
    }
}

var spawner = {
    run: function(room) {
        console.log('spawner.RCL5')
        cleanMemory();     
        renewCreep(room);
        console.log(room.name + '.energyAvailable ' + room.energyAvailable)
        console.log(room.name + '.energyCapacityAvailable ' + room.energyCapacityAvailable)
        
        var creepTypes = {
            harvester : {
                limit: 3,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                namePrevix: 'harvester',
                role: 'harvester'
            },
            upgrader : {
                limit: 1,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,CARRY],
                namePrevix: 'upgrader',
                role: 'upgrader'
            },
            upgraderex : {
                limit: 0,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY],
                namePrevix: 'upgraderex',
                role: 'upgraderex'
            },
            builder : {
                limit: 1,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                namePrevix: 'builder',
                role: 'builder'
            },
            builderExpan : {
                limit: 1,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                namePrevix: 'builderex',
                role: 'builderexp'
            },
            soldier : {
                limit: 0,
                exist: 0,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                namePrevix: 'soldier',
                role: 'soldier'
            },
            healer : {
                limit: 0,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'healer',
                role: 'healer'
            },
            scavenger: {
                limit: 1,
                exist: 0,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                namePrevix: 'scavenger',
                role: 'scavenger'
            },
            claimer: {
                limit: 0,
                exist: 0,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CLAIM],
                namePrevix: 'claimer',
                role: 'claimer'
            },
            miner: {
                limit: 1,
                exist: 0,
                body: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,CARRY],
                namePrevix: 'miner',
                role: 'miner'
            },
        }
       
       
        
        for(typeName in creepTypes)
            for (var name in Game.creeps)
                if (Game.creeps[name].memory.role == creepTypes[typeName].role)
                    creepTypes[typeName].exist += 1;
        console.log('harvester body: ' + creepTypes['harvester'].body)
        //если есть харвестеры и энергии достаточно делаем стандартный спаун
        if (creepTypes['harvester'].exist >= creepTypes['harvester'].limit){
            for(typeName in creepTypes){
                var cr = creepTypes[typeName];
                var healerTargets = room.find(FIND_STRUCTURES, {filter: (s) => ((s.hits < s.hitsMax) && (s.structureType == STRUCTURE_ROAD))});
                var builderTargets = room.find(FIND_CONSTRUCTION_SITES);
                if ((cr.role != 'builder' && cr.role != 'healer' && cr.exist < cr.limit) ||
                    (cr.role == 'builder' && builderTargets.length > 0 && cr.exist < cr.limit ) ||
                    (cr.role == 'healer' && healerTargets.length > 0 && cr.exist < cr.limit ))
                        Game.spawns['Spawn1'].spawnCreep(cr.body, cr.namePrevix + Game.time, {memory: {role: cr.role, harvest:'true'}});
            }
        }
        else{
            if (room.energyAvailable >= 300){
                // если харвестеров нет то создать именно харвестер с базовой тушкой
                var result = Game.spawns['Spawn1'].spawnCreep(creepTypes['harvester'].body, creepTypes['harvester'].namePrevix + Game.time, {
                    memory: {role: creepTypes['harvester'].role, harvest:'true'}});
                console.log('spawn result: ' + result)
            }
        }
    }
}

module.exports = spawner;
