window.onhashchange = function (ev) {
        var $t;
        HashMapper.MapInfo.currentHashLocation = window.location.hash;

        var currentRunningMapInfos = new (System.Collections.Generic.List$1(HashMapper.MapInfo))();

        var hashs = HashMapper.MapInfo.currentHashLocation.split(HashMapper.MapInfo.hashSeperator);

        var i;
        var y;
        var hashLength = hashs.length;
        var mapLength = HashMapper.MapInfo.mappings.getCount();

        for (y = 0; y < mapLength; y = (y + 1) | 0) {
            for (i = 0; i < hashLength; i = (i + 1) | 0) {
                try {
                    if (Bridge.referenceEquals(HashMapper.MapInfo.mappings.getItem(y)._hash, hashs[i])) {
                        var map = HashMapper.MapInfo.mappings.getItem(y);
                        if (!HashMapper.MapInfo.previousRanMapInfos.contains(map)) {
                            if (!Bridge.staticEquals(map.getOnNavigated(), null)) {
                                map.getOnNavigated()(map);
                            }
                        }
                        currentRunningMapInfos.add(map);
                        break;
                    }
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                }
            }
        }

        $t = Bridge.getEnumerator(HashMapper.MapInfo.previousRanMapInfos);
        while ($t.moveNext()) {
            var item = $t.getCurrent();
            if (!currentRunningMapInfos.contains(item)) {
                if (!Bridge.staticEquals(item.getOnLeft(), null)) {
                    item.getOnLeft()(item);
                }
            }
        }

        HashMapper.MapInfo.previousRanMapInfos = currentRunningMapInfos;
        HashMapper.MapInfo.previousHashLocation = window.location.hash;
    };

/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 15.7.0
 */
Bridge.assembly("HashMapper", function ($asm, globals) {
    "use strict";

    Bridge.define("HashMapper.MapInfo", {
        statics: {
            mappings: null,
            previousHashLocation: null,
            currentHashLocation: null,
            previousRanMapInfos: null,
            hashSeperator: "-",
            config: {
                init: function () {
                    this.mappings = new (System.Collections.Generic.List$1(HashMapper.MapInfo))();
                    this.previousRanMapInfos = new (System.Collections.Generic.List$1(HashMapper.MapInfo))();
                }
            }
        },
        _hash: null,
        config: {
            properties: {
                OnNavigated: null,
                OnLeft: null
            }
        },
        $ctor1: function (hash, onNavigated, onLeft) {
            if (onNavigated === void 0) { onNavigated = null; }
            if (onLeft === void 0) { onLeft = null; }

            this.$initialize();
            this._hash = hash;
            this.setOnNavigated(onNavigated);
            this.setOnLeft(onLeft);
        },
        ctor: function (hash, onNavigated) {
            this.$initialize();
            this._hash = hash;
            this.setOnNavigated(onNavigated);
        },
        getHash: function () {
            return this._hash;
        }
    });
});
