module.exports = {
    transfer: function(){
        var dest = Game.getObjectById('5bdb5696ee923f037998e41f');
        var src = Game.getObjectById('5bdb9e2b7e9b2e7ece0cc266');
        if (dest.energy == 0)
            src.transferEnergy(dest);
    }
};