/*global window,mailru:true*/
/*jslint sloppy:true*/
if (typeof mailru !== 'object') {
    mailru = {};
}

mailru.loader = mailru.loader || {};
mailru.loader.getEnv = function () {
    var isHttps = window.location.protocol === 'https:',
        prerelease = window.location.href.match(/__prerelease/i) !== null,
        branchMatch = window.location.href.match(/__branch=([a-z0-9\-]*)/i),
        branch = (branchMatch && branchMatch.length > 0) ? branchMatch[1] : '';
    return { 'branch': branch, 'isHttps': isHttps, 'prerelease': prerelease };
};
mailru.loader.getMode = function (moduleEnv) {

    //default mode is always http-live
    var mode = 'http-live';

    // if current protocol is HTTPS and the branch is set, all content will be served from alphas via https,
    // branch parameter will be persisted in all consequent URLs
    if (moduleEnv.branch !== '' && moduleEnv.isHttps) {
        mode = 'https-alpha';
    } else if (moduleEnv.branch !== '') {
        // if current protocol is not https but branch is set, content will be served from alphas with branch
        // via http, branch will be persisted in all consequent URLs
        mode = 'http-alpha';
    } else if (moduleEnv.prerelease) {
        mode = 'http-prerelease'; // myalpha6
    } else if (moduleEnv.isHttps) {
        // if current protocol is https and no branch is set, then it's a live site with
        // https, all content should be served from live https
        mode = 'https-live';
    }

    // if no conditions apply, it's just a live site served via http
    return mode;
};

var mailru = mailru || {};
(function(){
   var loader = {
       modvers: {
           receiver: 1,
           proxy: 22,
           api: 122,
           api_dev: 3,
           xdm: 5
       },
       modreleases: {
           receiver: null,
           proxy: null,
           api: null,
           api_dev: null,
           xdm: null
       },
       _modulePath: '//my2.imgsmail.ru/mail/ru/images/js/connect/',
       moduleEnv: {}, //additional environment data for the modules
       initEnv: function(){
           'use strict';
            var env = mailru.loader.getEnv(),
                modulePaths = {
                    'http-live':   'http://my2.imgsmail.ru/mail/ru/images/js/connect/',
                    'https-live':  'https://my2.imgsmail.ru/mail/ru/images/js/connect/',
                    'http-alpha':  'http://'  + env.branch + '.myalpha.imgsmail.ru/mail/ru/images/js/connect/',
                    'https-alpha': 'https://' + env.branch + '.myalpha.imgsmail.ru/mail/ru/images/js/connect/',
                    'http-prerelease':  'http://psi.imgsmail.ru/mail/ru/images/js/connect/'
                },
                modulePath = modulePaths[mailru.loader.getMode(env)];

           mailru.loader._modulePath = modulePath;
           mailru.loader.moduleEnv = env;
       },
       _loaded: {},
       _readyCallbacks: {},
       require: function(module, onready, deferLoad){
           mailru.loader.initEnv();
           if(this._loaded[module]){
               onready();
           } else {
               if(!this._readyCallbacks[module]){
                   if(typeof this._readyCallbacks[module] === 'undefined')
                       this._readyCallbacks[module] = [];
                   this._readyCallbacks[module].push(onready);
                   var modver = (this.modvers[module] && ('?'+ this.modvers[module])) || '';
                   var modrelease = (this.modreleases[module] && ('/' + this.modreleases[module]) + '/') || '/';
                   deferLoad = mailru.isIE && deferLoad? true : false;
                   document.URL.match(/testmode=1/) && (modver = '');

                   with(document.getElementsByTagName('head')[0].appendChild(document.createElement('script'))){
                      var env = mailru.loader.getEnv();
                       type = 'text/javascript';
                       src = this._modulePath + module + modrelease + (module === 'api' && env.branch === '' ? 'api_min' : module) + '.js' + modver;
                       if(deferLoad){
                           defer = "defer";
                       }
                   }
               } else {
                   this._readyCallbacks[module].push(onready);
               }

           }
       },
       onready: function(module){
           if(this._readyCallbacks[module]){
               this._loaded[module] = true;
               var cbs = this._readyCallbacks[module],
               throwingMatch = location.href.match(/throwing=1/i),
                   throwExceptions = (throwingMatch && throwingMatch.length > 0);
               if(cbs.length) {
                   for(var i=0; i<cbs.length; i++){
                       if (!throwExceptions) {
                           try{
                               cbs[i]();
                           } catch(e) {
                           }
                       } else {
                           cbs[i]();
                       }
                   }
               }

           }
       }
    };
    function extend(dst, src) {
        var p;
        for (p in src) {
            if (src.hasOwnProperty(p) && p != 0) {
                if (dst.hasOwnProperty(p)) {
                    extend(dst[p], src[p]);
                } else {
                    dst[p] = src[p];
                }
            }
        }
    }
    // mailru.loader can be either not initialised completely or can be initialised only partly
    if (mailru.loader) {
        // initialised, but only partly
        if (!mailru.loader.onready) {
            extend(mailru.loader, loader);
        }
    } else {
        // wasn't initialised completely
        mailru.loader = loader;
    }

    mailru.loader.initEnv();

    mailru.isIE = (function () {
        var tmp = document.documentMode, e, isIE;
        try{document.documentMode = "";}
        catch(e){ };
        isIE = typeof document.documentMode == "number" ? 11 : eval("/*@cc_on!@*/!1");
        try{document.documentMode = tmp;}
        catch(e){ };
        return isIE;
    })();
    mailru.isOpera = !!window.opera;
    mailru.isApp = false;

    if (window.name.indexOf('app') !== -1 && window.name.indexOf('mailruapp') !== -1) {
        mailru.isApp = true;
    }

    mailru.intercomType = ( (window.postMessage && !mailru.isIE) || (mailru.isApp && mailru.isIE && window.postMessage))? 'event' : (((function(){var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=RegExp("^"+u+" (\\d+)");if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i}catch(e){}return 0;})() < 10) ? 'hash' : 'flash');

    mailru.init = function(onready, private_key, DOMFlashId){
        mailru.loader.require('api', function(){
            try{
                mailru.app.init(private_key);
            }catch(e){}
            var e;
            if(DOMFlashId && (e=document.getElementById(DOMFlashId))){
                setTimeout(onready, 1);
                mailru.events.listen('event', function(name, data){
                    document.getElementById(DOMFlashId).mailruEvent(name, data);
                });
            }
        });
    };
    mailru.autoInit = (function(){
        if (!mailru.disableAutoInit) {
            var a = document.getElementsByTagName('a'), al = a.length;
            for(var i = 0; i < al; i++){
                if (typeof a[i] !== 'undefined' && a[i].className.indexOf('mrc__plugin') != -1) {
                    mailru.loader.require('api', function(){
                        mailru.plugin.init();
                    });
                    break;
                }
            }
        }
   })();

}());

