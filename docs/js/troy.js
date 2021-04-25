/**
* 前端性能监控通用 js
*
*/

// this isn't a es2015 script
/* eslint no-var: "off" */
/* eslint prefer-arrow-callback: "off" */
/* eslint prefer-template: "off" */
/* eslint no-implicit-coercion: "off" */
var reportURL;
if (location.host.indexOf('jc.dev.ly.com') !== -1) {
    // 集成开发环境
    reportURL = 'https://srv.dev.ly.cn';
} else if (location.host.indexOf('dev.lydc.com') !== -1) {
    // 开发环境
    reportURL = 'https://srv.dev.ly.cn';
} else if (location.host.indexOf('test.lydc.com') !== -1 || location.host.indexOf('test.ly.cn') !== -1) {
    // 测试环境
    reportURL = 'https://srv.test.ly.cn';
} else if (location.host.indexOf('pre.jk.cn') !== -1) {
    // 预发环境
    reportURL = 'https://srv.jk.cn';
} else if (location.host.indexOf('jk.cn') !== -1) {
    // 正式线上环境
    reportURL = 'https://srv.jk.cn';
} else {
    reportURL = 'https://srv.jk.cn';
}

// idle until next save
var SAVE_DEBOUNCE = 5000;
// idle until next send
var SEND_DEBOUNCE = 5000;
/*
if (typeof Object.assign !== 'function') {
 Object.assign = function(target) {
   'use strict';
   if (target == null) {
     throw new TypeError('Cannot convert undefined or null to object');
   }

   target = Object(target);
   for (var index = 1; index < arguments.length; index++) {
     var source = arguments[index];
     if (source != null) {
       for (var key in source) {
         if (Object.prototype.hasOwnProperty.call(source, key)) {
           target[key] = source[key];
         }
       }
     }
   }
   return target;
 };
}
*/
function serialize(obj, prefix) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + '[" + p + "]' : p,
                v = obj[p];
            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return str.join('&');
}

function getLogTime() {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }
    var t = new Date();
    return t.getUTCFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()) + ' ' + pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds()) + '.' + (t.getMilliseconds() / 1000).toFixed(3).slice(2, 5) + '';
}

// use perf now if available
// var now = window.performance ? window.performance.now.bind(window.performance) : Date.now;

/*
  Troy Logger
  {
    appName,
    reportURL,
    ignoreError, // 不上报错误
    persistence, // 使用localStorage积攒上报信息（减少总请求）
    persistKey, // 默认 perfLogs
    ver 当前版本，当版本改变时，清除上一次的数据 (string,默认'0')
  }
*/
function Troy(opt) {
    try {

        if (window.performance && window.performance.timing && window.performance.timing.fetchStart) {
            // 精确的时间戳
            this.INIT_TIME = window.performance.timing.fetchStart;
        } else {
            this.INIT_TIME = window.INIT_TIME || Date.now();
        }

        // window.addEventListener("hashchange", this.reinitialize, false);

        // options
        var options = opt || {};
        // var reportURL = options.reportURL || 'http://srv.test.ly.cn';

        this.appName = options.appName || 'h5-script-test';
        this.logType = 'perf';
        this.errorType = 'fault';
        this.hash = opt.hash || window.location.hash.split('?')[0];

        this.threshold = options.threshold || 2;

        // this.customMessagePrefix = 'log-';
        this.reportURL = reportURL + '/log-collector/log/put';
        this.batchReportURL = reportURL + '/log-collector/log/batch/put';

        this.persistence = options.persistence;

        // datas
        // all raw records goes here
        this.records = {};

        var ver = opt.ver || '0';
        this.ver = ver;
        var lastVersion = localStorage.getItem('@@perfMonVer');
        if (this.persistence) {
            this.persistKey = options.persistKey || 'perfLogs';
            this.persistKey += '@' + this.hash;
            if (lastVersion !== ver) {
                // reset
                localStorage.setItem('@@perfMonVer', ver);
            } else {
                var str = localStorage.getItem(this.persistKey);
                if (str) {
                    try {
                        var records = JSON.parse(str);
                        this.records = records;
                        localStorage.removeItem(this.persistKey);
                    } catch (ex) { }
                }
            }
        }

        // uploading queue
        this._queue = [];

        // bind necessary functions
        this.record = this.record.bind(this);
        this.createTiming = this.createTiming.bind(this);
        this.addWorker = this.addWorker.bind(this);
        this.completeWorker = this.completeWorker.bind(this);
        this.reportAll = this.reportAll.bind(this);

        this.flushQueue = this.flushQueue.bind(this);
        this.parseLog = this.parseLog.bind(this);
        this.saveRecords = this.saveRecords.bind(this);
        this.enque = this.enque.bind(this);

        // temp data for timing
        this._timingId = 0;
        this._tempTiming = {};
        this._workers = {};
        this._workerTiming = {};
        if (!options.ignoreError) {
            window.onerror = this.onError.bind(this);
        }

        window.addEventListener('load', this.onLoad.bind(this), false);
        document.addEventListener('DOMContentLoaded', this.domContentLoaded.bind(this), false);

        if (this.persistence) {
            window.addEventListener('unload', this.saveRecords);
        }
    } catch (ex) {
        console.error('[Troy] error', ex);
    }

    // window.addEventListener('unload', this.flushQueue); unload时flush也没用
}

Troy.prototype.onLoad = function () {
    this.record('totalOnload', Date.now() - this.INIT_TIME);
    // 计算方法必须放到 setTimeout 里, 否则 loadEventEnd 为 0
    setTimeout(this.parsePerformanceTiming.bind(this), 0);
    return true;
};

Troy.prototype.domContentLoaded = function () {
    this.record('totalDomContentLoaded', Date.now() - this.INIT_TIME);
};

/**
* Append new record (time span)
*/
Troy.prototype.record = function (key, value) {
    console.log('[Troy] record', key, value);
    // read current record
    if (value < 0) {
        return;
    }
    var records = this.records;
    if (!records[key]) {
        // init record
        records[key] = {
            total: value,
            count: 1
        };
    } else {
        // add to current record
        records[key].count++;
        records[key].total += value;

        // send the data if threshold hit
        if (records[key].count >= this.threshold) {
            this.enque(key);
        }
    }

    if (this.persistence) {
        // persist data
        clearTimeout(this.persistenceHandler);
        this.persistenceHandler = setTimeout(this.saveRecords, SAVE_DEBOUNCE);
    }
};

/*
 * save records to localStorage
 */
Troy.prototype.saveRecords = function () {
    localStorage.setItem(this.persistKey, JSON.stringify(this.records));
};

/**
* Enque the gathered data, and remove it from the collection
*/
Troy.prototype.enque = function (key, immediate) {
    if (!this.records[key]) return;
    var value = Math.floor(this.records[key].total / this.records[key].count);
    var record = {
        logMessage: key,
        perfData: value,
        logTime: getLogTime()
    };
    this._queue.push(record);
    delete this.records[key];

    clearTimeout(this.flushQueueHandler);
    if (immediate || this._queue.length > 30) {
        // flush immediately
        this.flushQueue();
    } else {
        this.flushQueueHandler = setTimeout(this.flushQueue, SEND_DEBOUNCE);
    }
};

/*
 * Flush message queue immediately
 */
Troy.prototype.flushQueue = function () {
    if (!this._queue.length) return null;
    var scope = this;
    var params = this._queue.map(function (item) {
        return scope.parseLog(item, scope.logType);
    });
    this._queue = [];
    return this.req(params, this.batchReportURL);
};

/**
* 通用报错函数
*/
Troy.prototype.onError = function (msg, url, line, col, error) {
    msg = ("" + (msg || ""));
    // 非同源 js无法上报
    var string = msg.toLowerCase();
    if (string.indexOf('script error') > -1) {
        console.log('[Troy] Script Error: See Browser Console for Detail');
        return false;
    }
    // console.warn(arguments);
    var data = {};
    data.logMessage = msg || '';
    data.errorUrl = url || window.location.href;
    data.errorLine = line || '';
    data.errorCol = col || '';
    data.type = this.errorType;
    if (error && error.stack) {
        data.errorStack = encodeURI(error.stack);
    }
    // 直接发送数据
    data.logTime = getLogTime();
    data.hash = this.hash;
    this.sendLog(data, this.errorType);
    return false;
};

/**
* 根据浏览器自带api 记录性能指标
*/
Troy.prototype.parsePerformanceTiming = function () {
    // https://www.w3.org/TR/navigation-timing/timing-overview.png
    // https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn
    var perf = window.performance;
    if (!perf) {
        // console('this browser don\'t support performance');
        return false;
    }
    var t = performance.timing;
    // onLoad时间
    // this.record('appCache', t.domainLookupStart - t.fetchStart);
    // this.record('dns', t.domainLookupEnd - t.domainLookupStart);
    // this.record('tcp', t.connectEnd - t.connectStart);
    // this.record('redirect', t.redirectEnd - t.redirectStart);
    // html加载时间

    var domContentLoaded = t.domContentLoadedEventEnd - t.responseEnd;
    // 数据异常，不记录
    if (domContentLoaded < 0) return false;
    var request = t.responseEnd - t.fetchStart;
    // 数据异常，不记录
    if (request < 0) return false;
    this.record('domComplete', t.domComplete - t.domContentLoadedEventEnd);
    this.record('loadEvent', t.loadEventEnd - t.loadEventStart);
    this.record('unloadEvent', t.unloadEventEnd - t.unloadEventStart);
    this.record('request', request);
    this.record('domContentLoaded', domContentLoaded);
    // this.record('processHtml', t.domInteractive - t.domLoading);
    // this.record('loadPage', t.loadEventEnd - t.fetchStart);
    if (performance.getEntriesByType) {
        var perfs = performance.getEntriesByType('resource');
        var imageFinish = 0;
        for (var ind = 0; ind < perfs.length; ind++) {
            var item = perfs[ind];
            if (item.initiatorType === 'img') {
                if (item.responseEnd && item.responseEnd > imageFinish) {
                    imageFinish = item.responseEnd;
                }
            }
        }
    }
    if (imageFinish) {
        this.record('totalImageLoaded', imageFinish);
    }
};

/*
 * Create custom timing
 */
Troy.prototype.createTiming = function (key, customDate) {
    var currentId = this._timingId++;
    this._tempTiming[currentId] = {
        key: key,
        date: customDate || Date.now(),
        isCustom: !!customDate
    };
    var scope = this;
    return function finish(finishCustomDate) {
        var data = scope._tempTiming[currentId];
        if (data.isCustom) {
            if (!finishCustomDate) {
                console.warn('你传入了一个自定的时间点，但是没有传入完成的时间点');
                // return;
            }
            scope.record(data.key, (finishCustomDate || Date.now()) - data.date);
        } else {
            scope.record(data.key, Date.now() - data.date);
        }
        // release memory
        delete scope._tempTiming[currentId];
    };
};
/*
 *
 */
Troy.prototype.addWorker = function (key, customDate) {
    if (!this._workers[key]) {
        this._workers[key] = {
            count: 1,
            // start time
            date: customDate || Date.now(),
            isCustom: !!customDate
        };
    } else {
        this._workers[key].count++;
    }
};

Troy.prototype.completeWorker = function (key, customDate) {
    if (this._workers[key]) {
        this._workers[key].count--;
        if (this._workers[key].count === 0) {
            // all job has completed, record
            var data = this._workers[key];
            if (data.isCustom) {
                if (!customDate) {
                    console.warn('你传入了一个自定的时间点，但是没有传入完成的时间点');
                    // return;
                }
                this.record(key, (customDate || Date.now()) - data.date);
            } else {
                this.record(key, Date.now() - data.date);
            }
            // release memory
            delete this._workers[key];
        }
    }
};

/*
 * Force report all records
 */
Troy.prototype.reportAll = function () {
    console.log('[Troy] report all', this.records);
    var enque = this.enque;
    Object.keys(this.records).forEach(function (key) {
        enque(key);
    });
};

/**
* 记录从页面打开，到当前时间花费的时间
  optional: time actual time of occurance
*/

Troy.prototype.makeLog = function (name, time) {
    if (!name) return false;
    this.record(name, (time || Date.now()) - this.INIT_TIME);
};

// send a single record (error)
Troy.prototype.sendLog = function (data, type) {
    var params = this.parseLog.apply(this, arguments);
    // queue error logs
    this._queue.push(params);
    clearTimeout(this.flushQueueHandler);
    if (this._queue.length > 30) {
        // flush immediately
        this.flushQueue();
    } else {
        this.flushQueueHandler = setTimeout(this.flushQueue, SEND_DEBOUNCE);
    }
    // return this.req(params, this.reportURL);
};

/**
* 数据准备 mutate, save memory
*/
Troy.prototype.parseLog = function (data, type) {
    data.userAgent = navigator.userAgent;
    data.v = this.ver;
    data.hash = this.hash;
    data.appName = this.appName;
    if (!data.type) {
        data.type = type || this.logType;
    }
    return data;
};
/*
Troy.prototype.resetDate = function() {
 this.INIT_TIME = +new Date;
};
*/
/**
* ajax request
*/
Troy.prototype.req = function (data, url) {
    console.log('[Troy] reporting:', data);
    var params = encodeURI(btoa(JSON.stringify(data)));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(serialize({
        data: params
    }));
    return true;
};
window.Troy = Troy;


if (!window.btoa) {
    // 下面是64个基本的编码
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    // 编码的方法
    window.btoa = function base64encode(str) {
        if (typeof str !== "string") str += "";
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    };
}