/* eslint-disable */
var ActivityStat = {};
var sdk_version = "1";
var debuggerEnable = true;
var app_id = "5";
// var app_key = "df177c2c47124c759b7e72d6a0886faf";//测试
var app_key = "9a8c23407d0311e9a7ac812dcef4f772";//生产
var server_url = "https://action.tfzq.com:20443/servlet/json";//生产
/*********************************************UUID***********************************************/
document.write("<script language=javascript src='http://pv.sohu.com/cityjson?ie=utf-8'></script>");
+function (ActivityStat) {
  var getUUID = function(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  };

  ActivityStat.uuid = {};
  ActivityStat.uuid.getUUID = getUUID;
}(ActivityStat);

/*********************************************Base64***********************************************/
+function (ActivityStat) {
  var a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
    b = function(a) {
      for (var b = new Array; a > 0;) {
        var c = a % 2;
        a = Math.floor(a / 2),
          b.push(c)
      }
      return b.reverse(),
        b
    },
    c = function(a) {
      for (var b = 0,
             c = 0,
             d = a.length - 1; d >= 0; --d) {
        var e = a[d];
        1 == e && (b += Math.pow(2, c)),
          ++c
      }
      return b
    },
    d = function(a, b) {
      for (var c = 8 - (a + 1) + 6 * (a - 1), d = b.length, e = c - d; --e >= 0;) b.unshift(0);
      for (var f = [], g = a; --g >= 0;) f.push(1);
      f.push(0);
      for (var h = 0,
             i = 8 - (a + 1); i > h; ++h) f.push(b[h]);
      for (var j = 0; a - 1 > j; ++j) {
        f.push(1),
          f.push(0);
        for (var k = 6; --k >= 0;) f.push(b[h++])
      }
      return f
    },
    e = {
      encoder: function(e) {
        for (var f = [], g = [], h = 0, i = e.length; i > h; ++h) {
          var j = e.charCodeAt(h),
            k = b(j);
          if (128 > j) {
            for (var l = 8 - k.length; --l >= 0;) k.unshift(0);
            g = g.concat(k)
          } else j >= 128 && 2047 >= j ? g = g.concat(d(2, k)) : j >= 2048 && 65535 >= j ? g = g.concat(d(3, k)) : j >= 65536 && 2097151 >= j ? g = g.concat(d(4, k)) : j >= 2097152 && 67108863 >= j ? g = g.concat(d(5, k)) : j >= 4e6 && 2147483647 >= j && (g = g.concat(d(6, k)))
        }
        for (var m = 0,
               h = 0,
               i = g.length; i > h; h += 6) {
          var n = h + 6 - i;
          2 == n ? m = 2 : 4 == n && (m = 4);
          for (var o = m; --o >= 0;) g.push(0);
          f.push(c(g.slice(h, h + 6)))
        }
        for (var p = "",
               h = 0,
               i = f.length; i > h; ++h) p += a[f[h]];
        for (var h = 0,
               i = m / 2; i > h; ++h) p += "=";
        return p
      },
      decoder: function(d) {
        var e = d.length,
          f = 0;
        "=" == d.charAt(e - 1) && ("=" == d.charAt(e - 2) ? (f = 4, d = d.substring(0, e - 2)) : (f = 2, d = d.substring(0, e - 1)));
        for (var g = [], h = 0, i = d.length; i > h; ++h) for (var j = d.charAt(h), k = 0, l = a.length; l > k; ++k) if (j == a[k]) {
          var m = b(k),
            n = m.length;
          if (6 - n > 0) for (var o = 6 - n; o > 0; --o) m.unshift(0);
          g = g.concat(m);
          break
        }
        f > 0 && (g = g.slice(0, g.length - f));
        for (var p = [], q = [], h = 0, i = g.length; i > h;) if (0 == g[h]) p = p.concat(c(g.slice(h, h + 8))),
          h += 8;
        else {
          for (var r = 0; i > h && 1 == g[h];)++r,
            ++h;
          for (q = q.concat(g.slice(h + 1, h + 8 - r)), h += 8 - r; r > 1;) q = q.concat(g.slice(h + 2, h + 8)),
            h += 8,
            --r;
          p = p.concat(c(q)),
            q = []
        }
        return p
      }
    };

  ActivityStat.base64 = e;
}(ActivityStat);

/*********************************************MD5封装***********************************************/
+function (ActivityStat) {

  /*
      * Configurable variables. You may need to tweak these to be compatible with
      * the server-side, but the defaults work in most cases.
      */
  var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
  var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
  var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

  /*
      * These are the functions you'll usually want to call
      * They take string arguments and return either hex or base-64 encoded strings
      */
  function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
  function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
  function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
  function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
  function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
  function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

  /*
      * Perform a simple self-test to see if the VM is working
      */
  function md5_vm_test()
  {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
  }

  /*
      * Calculate the MD5 of an array of little-endian words, and a bit length
      */
  function core_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }
  /*
      * These functions implement the four basic operations the algorithm uses.
      */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  /*
      * Calculate the HMAC-MD5, of a key and some data
      */
  function core_hmac_md5(key, data)
  {
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }
  /*
      * Add integers, wrapping at 2^32. This uses 16-bit operations internally
      * to work around bugs in some JS interpreters.
      */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  /*
      * Bitwise rotate a 32-bit number to the left.
      */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
      * Convert a string to an array of little-endian words
      * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
      */
  function str2binl(str)
  {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
  }
  /*
      * Convert an array of little-endian words to a string
      */
  function binl2str(bin)
  {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < bin.length * 32; i += chrsz)
      str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
  }

  /*
      * Convert an array of little-endian words to a hex string.
      */
  function binl2hex(binarray)
  {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
      str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
        hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
  }

  /*
      * Convert an array of little-endian words to a base-64 string
      */
  function binl2b64(binarray)
  {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
      var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
        | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
        |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
        else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
      }
    }
    return str;
  }
  ActivityStat.md5 = {};
  ActivityStat.md5.hex_md5 = hex_md5;
}(ActivityStat);

/*********************************************JSON封装***********************************************/
+function (ActivityStat) {
  'use strict';
  var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
    meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    },
    hasOwn = Object.prototype.hasOwnProperty;
  var objectType = function(obj){
    if ( obj == null ) {
      return String( obj );
    }
    var type = Object.prototype.toString.call(obj);
    if(type == '[object Function]'){
      return 'function';
    }else if(type == '[object String]'){
      return 'string';
    }else if(type == '[object Number]'){
      return 'number';
    }else if(type == '[object Boolean]'){
      return 'boolean';
    }else if(type == '[object Array]'){
      return 'array';
    }else if(type == '[object Object]'){
      return "object";
    }else{
      return 'param is no object type';
    }
  };
  var isArray =  Array.isArray || function( obj ) {
    return objectType(obj) === "array";
  };
  /**
   * jQuery.toJSON
   * Converts the given argument into a JSON representation.
   *
   * @param o {Mixed} The json-serializable *thing* to be converted
   *
   * If an object has a toJSON prototype, that will be used to get the representation.
   * Non-integer/string keys are skipped in the object, as are keys that point to a
   * function.
   *
   */
  var toJSON = function (o){
    if(typeof JSON === 'object' && JSON.stringify ){
      return JSON.stringify(o);
    }else{
      if (o === null) {
        return 'null';
      }
      var pairs, k, name, val,
        type = objectType(o);
      if (type === 'undefined') {
        return undefined;
      }
      // Also covers instantiated Number and Boolean objects,
      // which are typeof 'object' but thanks to $.type, we
      // catch them here. I don't know whether it is right
      // or wrong that instantiated primitives are not
      // exported to JSON as an {"object":..}.
      // We choose this path because that's what the browsers did.
      if (type === 'number' || type === 'boolean') {
        return String(o);
      }
      if (type === 'string') {
        return quoteString(o);
      }
      if (typeof o.toJSON === 'function') {
        return toJSON(o.toJSON());
      }
      if (type === 'date') {
        var month = o.getUTCMonth() + 1,
          day = o.getUTCDate(),
          year = o.getUTCFullYear(),
          hours = o.getUTCHours(),
          minutes = o.getUTCMinutes(),
          seconds = o.getUTCSeconds(),
          milli = o.getUTCMilliseconds();
        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        if (milli < 100) {
          milli = '0' + milli;
        }
        if (milli < 10) {
          milli = '0' + milli;
        }
        return '"' + year + '-' + month + '-' + day + 'T' +
          hours + ':' + minutes + ':' + seconds +
          '.' + milli + 'Z"';
      }
      pairs = [];
      if (isArray(o)) {
        for (k = 0; k < o.length; k++) {
          pairs.push(toJSON(o[k]) || 'null');
        }
        return '[' + pairs.join(',') + ']';
      }
      // Any other object (plain object, RegExp, ..)
      // Need to do typeof instead of $.type, because we also
      // want to catch non-plain objects.
      if (typeof o === 'object') {
        for (k in o) {
          // Only include own properties,
          // Filter out inherited prototypes
          if (hasOwn.call(o, k)) {
            // Keys must be numerical or string. Skip others
            type = typeof k;
            if (type === 'number') {
              name = '"' + k + '"';
            } else if (type === 'string') {
              name = quoteString(k);
            } else {
              continue;
            }
            type = typeof o[k];

            // Invalid values like these return undefined
            // from toJSON, however those object members
            // shouldn't be included in the JSON string at all.
            if (type !== 'function' && type !== 'undefined') {
              val = toJSON(o[k]);
              pairs.push(name + ':' + val);
            }
          }
        }
        return '{' + pairs.join(',') + '}';
      }
    }
  };
  /**
   * jQuery.evalJSON
   * Evaluates a given json string.
   *
   * @param str {String}
   */
  var evalJSON = function(str){
    if(typeof JSON === 'object' && JSON.parse){
      return JSON.parse(str);
    }else{
      /*jshint evil: true */
      return eval('(' + str + ')');
    }
  };
  /**
   * jQuery.secureEvalJSON
   * Evals JSON in a way that is *more* secure.
   *
   * @param str {String}
   */
  var secureEvalJSON = function(Str){
    if(typeof JSON === 'object' && JSON.parse ){
      return JSON.parse(str);
    }else{
      var filtered =
        str
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '');

      if (/^[\],:{}\s]*$/.test(filtered)) {
        /*jshint evil: true */
        return eval('(' + str + ')');
      }
      throw new SyntaxError('Error parsing JSON, source is not valid.');
    }
  };
  /**
   * jQuery.quoteString
   * Returns a string-repr of a string, escaping quotes intelligently.
   * Mostly a support function for toJSON.
   * Examples:
   * >>> jQuery.quoteString('apple')
   * "apple"
   *
   * >>> jQuery.quoteString('"Where are we going?", she asked.')
   * "\"Where are we going?\", she asked."
   */
  var quoteString = function(str){
    if (str.match(escape)) {
      return '"' + str.replace(escape, function (a) {
        var c = meta[a];
        if (typeof c === 'string') {
          return c;
        }
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + str + '"';
  };

  ActivityStat.json = {};
  ActivityStat.json.evalJSON = evalJSON;
  ActivityStat.json.toJSON = toJSON;
}(ActivityStat);

/*********************************************事件处理***********************************************/
+function (ActivityStat) {
  // 页面加载完成后
  // 主要是原生JS，页面只能加载一次window.onload；这里使用该方法可以绑定多个方法。
  var readyEvent = function(fn) {
    if (fn==null) {
      fn=document;
    }
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = fn;
    } else {
      window.onload = function() {
        oldonload();
        fn();
      };
    }
  };

  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 下面的顺序：标准dom2，IE dom2， dom
  // 参数： 操作的元素,事件名称 ,事件处理程序
  var addEvent = function(element, type, handler) {
    if (element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function() {
        handler.call(element);
      });
    } else {
      element['on' + type] = handler;
    }
  };

  // 移除事件
  var removeEvent = function(element, type, handler) {
    if (element.removeEnentListener) {
      element.removeEnentListener(type, handler, false);
    } else if (element.datachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  };

  // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
  var stopPropagation = function(ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();// 标准w3c
    } else {
      ev.cancelBubble = true;// IE
    }
  };

  // 取消事件的默认行为
  var preventDefault = function(event) {
    if (event.preventDefault) {
      event.preventDefault();// 标准w3c
    } else {
      event.returnValue = false;// IE
    }
  };

  // 获取事件目标
  var getTarget = function(event) {
    // 标准W3C 和 IE
    return event.target || event.srcElement;
  };

  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
  var getEvent = function(e) {
    var ev = e || window.event;
    if (!ev) {
      var c = this.getEvent.caller;
      while (c) {
        ev = c.arguments[0];
        if (ev && Event == ev.constructor) {
          break;
        }
        c = c.caller;
      }
    }
    return ev;
  };

  ActivityStat.eventUtil = {};
  ActivityStat.eventUtil.readyEvent = readyEvent;
  ActivityStat.eventUtil.addEvent = addEvent;
  ActivityStat.eventUtil.removeEvent = removeEvent;
  ActivityStat.eventUtil.stopPropagation = stopPropagation;
  ActivityStat.eventUtil.preventDefault = preventDefault;
  ActivityStat.eventUtil.getTarget = getTarget;
  ActivityStat.eventUtil.getEvent = getEvent;
}(ActivityStat);

/*********************************************ajax封装***********************************************/
+function (ActivityStat) {

  /****************ajax同域名***************/
  var createXHR = function(){
    var xhr = null;
    if(window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject){
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
  };

  var getParam = function(param){
    var result = "";
    if(param){
      for(var key in param){
        var value = param[key];
        if(!value){
          value = "";
        }
        result += (key + "=" + encodeURIComponent(value+"") + "&");
      }
    }
    if(result.length > 0){
      result = result.substring(0,result.length - 1);
    }
    return result;
  };

  var ajaxSameDomain = function(url,param,type,callback){
    if(!url || url.length == 0){
      return;
    }
    type = type || "post";
    param = JSON.stringify(param);
    //制造xhr
    var xhr = createXHR();
    xhr.withCredentials = false;
    //打开post链接
    xhr.open(type,url,true);
    //post的必须要有这个头信息才可以
    if(type == "post"){
      //发送
      xhr.send(param);
    }else{
      xhr.send("");
    }
    //状态
    xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        if(callback){
          callback(ActivityStat.json.evalJSON(this.responseText));
        }
      }else{
        if(this.status != 200){
          if(callback){
            callback(null);
          }
        }
      }
    };
    return false;
  };

  /****************ajax跨域名***************/
  var createAjaxIframe = function(id, uri){
    var frameId = 'jAjaxFrame' + id;
    var io;
    var browser = ActivityStat.net.getBrowser();
    if(window.ActiveXObject) {
      if(parseInt(browser.version) >= 9){
        io = document.createElement('iframe');
        io.id = frameId;
        io.name = frameId;
      }else{
        io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
        if(typeof uri== 'boolean'){
          io.src = 'javascript:false';
        }
        else if(typeof uri== 'string'){
          io.src = uri;
        }
      }
    } else {
      io = document.createElement('iframe');
      io.id = frameId;
      io.name = frameId;
    }
    io.style.position = 'absolute';
    io.style.top = '-1000px';
    io.style.left = '-1000px';
    document.body.appendChild(io);
    return io;
  };

  var createAjaxForm = function(id,data)
  {
    var formId = 'jAjaxForm' + id;
    var form = document.createElement('form');
    form.action = "";
    form.method = "POST";
    form.id = formId;
    form.name = formId;
    form.enctype = "application/x-www-form-urlencoded";
    if (data) {
      for (var i in data) {
        if (data[i].name != null && data[i].value != null) {
          var input = document.createElement('input');
          input.type = "hidden";
          input.name = data[i].name;
          input.value = encodeURIComponent(data[i].value+"");
          form.appendChild(input);
        } else {
          var input = document.createElement('input');
          input.type = "hidden";
          input.name = i + "";
          input.value = encodeURIComponent(data[i]+"");
          form.appendChild(input);
        }
      }
    }
    form.style.position = 'absolute';
    form.style.top = '-1200px';
    form.style.left = '-1200px';
    document.body.appendChild(form);
    return form;
  };

  var ajaxCrossDomain = function(url,param,type,callback){
    type = type || "POST";
    var id = new Date().getTime();
    var form = createAjaxForm(id, param);
    var io = createAjaxIframe(id,false);
    var frameId = 'jAjaxFrame' + id;
    var formId = 'jAjaxForm' + id;
    var requestDone = false;
    var response = null;
    var ajaxCallback = function(isTimeout){
      var io = document.getElementById(frameId);
      try {
        if(io.contentWindow){
          response = io.contentWindow.document.body?io.contentWindow.document.body.innerText:null;
        }else if(io.contentDocument){
          response = io.contentDocument.document.body?io.contentWindow.document.body.innerText:null;
        }
      }catch(e){
      }
      if ( response || isTimeout == "timeout") {
        requestDone = true;
        var status;
        try {
          status = isTimeout != "timeout" ? "success" : "error";
          if ( status != "error" ){
            var responseType = Object.prototype.toString.call(response);
            if(responseType == '[object String]'){
              var data =  null;
              try{
                eval( "data = " + response);
              }catch(ex){}
              if (callback ){
                callback(data);
              }
            }else{
              if (callback ){
                callback(null);
              }
            }
          } else{
            if (callback ){
              callback(null);
            }
          }
        } catch(e) {}
        ActivityStat.eventUtil.removeEvent(iframe,"load",ajaxCallback);
        setTimeout(function(){
          try {
            document.body.removeChild(io);
            document.body.removeChild(form);
          } catch(e){}}, 100);
        response = null;
      }else{
        if (callback ){
          callback(null);
        }
      }
    };
    try
    {
      var form = document.getElementById(formId);
      form.action = url;
      form.method = type;
      form.target = frameId;
      form.submit();
    } catch(e){}
    var iframe = document.getElementById(frameId);
    ActivityStat.eventUtil.addEvent(iframe,"load",ajaxCallback);
    return {abort: function () {}};
  };

  /****************ajax请求***************/
  var ajax = function(url,param,type,callback){
    var isCrossDomain = false;
    if(ActivityStat.string.startWith(url,"http://") || ActivityStat.string.startWith(url,"https://")){
      var currentDomain = window.location.protocol + "//"+window.location.host;
      if(!ActivityStat.string.startWith(url,currentDomain)){
        isCrossDomain = true;
      }
    }
    //判断是不是支持H5，支持H5的也认为是同域的逻辑，服务器已经支持
    if(window["localStorage"]){
      isCrossDomain = false;
    }
    if(isCrossDomain){
      ajaxCrossDomain(url, param, type, callback);
    }else{
      ajaxSameDomain(url, param, type, callback);
    }
  };

  ActivityStat.ajax = ajax;
}(ActivityStat);

/*********************************************本地存储***********************************************/
+function (ActivityStat) {
  /**
   * 功能：判断字符串是否为空,空格也算空
   * 参数：str:需要判断的字符串
   * 返回: true,false
   */
  var isEmpty = function(str){
    return (typeof(str) == "undefined" || str == null || trim(str) == "" || trim(str) == "undefined" || trim(str) == "null");
  };

  /**
   * 功能：判断字符串是否是非空
   * 参数：str:需要判断的字符串
   * 返回: true,false
   */
  var isNotEmpty = function(str){
    return !isEmpty(str);
  };

  /**
   * 功能:全部替换字符
   * 参数:source:原字符串
   *      oldStr:需要替换的字符串值
   *      newStr:用来替换的字符串值
   * 返回:替换后的新的字符串
   */
  var replaceAll = function(source,oldStr,newStr){
    if(source && oldStr){
      return source.split(oldStr).join(newStr);
    }
    return "";
  };

  /**
   * 功能:去掉两边空格(如果入参是undefined,null自动转换为"")
   * 参数:str:需要操作的字符串
   * 返回:去掉空格后的字符串
   */
  var trim = function(str){
    if(!str){
      return "";
    }else{
      return str.replace(/^\s+|\s+$/gm,'');
    }
  };

  /**
   * 功能:判断字符串是否以固定值结尾
   * 参数：source:要判断的字符串值
   *       str:固定值
   * 返回:true,false
   */
  var endsWith = function(source,str){
    if(isEmpty(source) || isEmpty(str)){
      return false;
    }else if(source.length < str.length){
      return false;
    }else if(source.substring(source.length - str.length , source.length) === str){
      return true;
    }else{
      return false;
    }
    return true;
  };

  /**
   * 功能：判断字符串是否以固定值开始
   * 参数：source:要判断的字符串值
   *       str:固定值
   * 返回:true,false
   */
  var startWith = function(source,str){
    if(isEmpty(source) || isEmpty(str)){
      return false;
    }else if(source.length < str.length){
      return false;
    }else if(source.substring(0 , str.length) === str){
      return true;
    }else{
      return false;
    }
    return true;
  };

  ActivityStat.string = {};
  ActivityStat.string.isEmpty = isEmpty;
  ActivityStat.string.isNotEmpty = isNotEmpty;
  ActivityStat.string.replaceAll = replaceAll;
  ActivityStat.string.trim = trim;
  ActivityStat.string.endsWith = endsWith;
  ActivityStat.string.startWith = startWith;
}(ActivityStat);

/*********************************************本地cookie***********************************************/
+function (ActivityStat) {
  var cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
      options = options || {};
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
      }
      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      var path = options.path ? '; path=' + (options.path) : '';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      var HttpOnly = options.HttpOnly ? ';HttpOnly' : '';
      document.cookie = [name, '=', value, expires, path, domain, secure,HttpOnly].join('');
    } else { // only name given, get cookie
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = ActivityStat.string.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = cookie.substring(name.length + 1);
            break;
          }
        }
      }
      return cookieValue;
    }
  };

  var clearCookie = function(name){
    if(name){
      cookie(name, '',{path: '/',secure: '',expires: -1});
    }else{
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for(var i = 0; i < keys.length; i ++){
          cookie(keys[i], '',{path: '/',secure: '',expires: -1});
        }
      }
    }
  };
  ActivityStat.cookie = {};
  ActivityStat.cookie.setItem = cookie;
  ActivityStat.cookie.getItem = cookie;
  ActivityStat.cookie.removeItem = clearCookie;
}(ActivityStat);


/*********************************************本地存储***********************************************/
+function (ActivityStat) {
  /**
   * 功能:设置session级别的cookie值
   * 参数：key:cookie的名称
   *      value:cookie的值
   */
  var setSessionStorage = function(key,value){
    value = ActivityStat.string.trim(value);
    value = ActivityStat.string.replaceAll(value,";","@#@");
    value = encodeURI(value);
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["sessionStorage"]){
        sessionStorage.setItem(key,value);
      }
    }else{
      ActivityStat.cookie.setItem(key, value,{path: '/',secure: ''});
    }
  };

  /**
   * 功能:设置local级别的cookie值(持久化存储)
   * 参数：key:cookie的名称
   *      value:cookie的值
   */
  var setLocalStorage = function(key,value,expires){
    value = ActivityStat.string.trim(value);
    value = ActivityStat.string.replaceAll(value,";","@#@");
    value = encodeURI(value);
    expires = expires || 3600;
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["localStorage"]){
        localStorage.setItem(key,value);
      }
    }else{
      ActivityStat.cookie.setItem(key, value,{ expires: expires, path: '/',secure: ''});
    }
  };

  /**
   * 功能：获取cookie值
   * 参数： key：cookie的名称
   * 返回:  cookie的值
   */
  var getSessionStorage = function(key){
    var value = "";
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["sessionStorage"]){
        value = sessionStorage.getItem(key);
      }
    }else{
      value = ActivityStat.cookie.getItem(key);
    }
    value = decodeURI(value);
    if(ActivityStat.string.isEmpty(value)){
      value = "";
    }
    value = ActivityStat.string.replaceAll(value,"@#@",";");
    return value;
  };

  /**
   * 功能：获取cookie值
   * 参数： key：cookie的名称
   * 返回:  cookie的值
   */
  var getLocalStorage = function(key){
    var value = "";
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["localStorage"]){
        value = localStorage.getItem(key);
      }
    }else{
      value = ActivityStat.cookie.getItem(key);
    }
    value = decodeURI(value);
    if(ActivityStat.string.isEmpty(value)){
      value = "";
    }
    value = ActivityStat.string.replaceAll(value,"@#@",";");
    return value;
  };

  /**
   * 功能：删除cookie值
   * 参数： key：cookie的名称
   * 返回:  cookie的值
   */
  var removeSessionStorage = function(key){
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["sessionStorage"]){
        sessionStorage.removeItem(key);
      }
    }else{
      ActivityStat.cookie.setItem(key, '',{path: '/',secure: '',expires: -1});
    }
  };

  /**
   * 功能：删除cookie值
   * 参数： key：cookie的名称
   * 返回:  cookie的值
   */
  var removeLocalStorage = function(key){
    var isFile = ActivityStat.string.startWith(window.location.href,"file://");
    if(isFile){
      if(window["localStorage"]){
        localStorage.removeItem(key);
      }
    }else{
      ActivityStat.cookie.setItem(key, '',{path: '/',secure: '',expires: -1});
    }
  };

  ActivityStat.storage = {};
  ActivityStat.storage.setSessionStorage = setSessionStorage;
  ActivityStat.storage.setLocalStorage = setLocalStorage;
  ActivityStat.storage.getSessionStorage = getSessionStorage;
  ActivityStat.storage.getLocalStorage = getLocalStorage;
  ActivityStat.storage.removeSessionStorage = removeSessionStorage;
  ActivityStat.storage.removeLocalStorage = removeLocalStorage;
}(ActivityStat);

/*********************************************URL参数处理***********************************************/
+function (ActivityStat) {
  var uaMatch = function( ua ) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];
    return {
      browser: match[ 1 ] || "",
      version: match[ 2 ] || "0"
    };
  };

  /**
   * 功能:获取pc上浏览器的类型信息
   */
  var getBrowser = function(){
    var matched = uaMatch(navigator.userAgent);
    var browser = {};
    if (matched.browser) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
    }
    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
      browser.webkit = true;
    } else if ( browser.webkit ) {
      browser.safari = true;
    }
    return browser;
  };

  /**
   * 功能:获得手机上浏览器的信息
   */
  var getMobileBrowser = function(){
    //浏览器运行环境相关信息
    var u = navigator.userAgent;
    var browser = {
      //是否为移动终端 ，/Mobile/i.test(u) 与 /AppleWebKit.*Mobile/i.test(u)重复，后期再看具体怎么区分
      mobile: /Mobile/i.test(u) || /AppleWebKit.*Mobile/i.test(u) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(u)),
      //是否为PC端
      pc: !(/Mobile/i.test(u) || /AppleWebKit.*Mobile/i.test(u) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(u))),
      uc: /UCWEB|UcBrowser/i.test(u), //是否为uc浏览器
      qq: /QQBrowser/i.test(u), //是否为qq浏览器
      android: u.indexOf('Android') > -1, //是否为android终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //是否为ios终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
      iPad: u.indexOf('iPad') > -1, //是否iPad
      trident: u.indexOf('Trident') > -1, //是否为IE内核
      presto: u.indexOf('Presto') > -1, //是否为opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //是否为苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //是否为火狐内核
      language: (navigator.browserLanguage || navigator.language).toLowerCase(),
      app: navigator.appVersion
    };
    return browser;
  };

  /**
   * 功能：得到URL的参数值对象
   */
  var getCurUrlParameter = function(){
    var queryParamStr = window.location.href;
    queryParamStr = decodeURI(queryParamStr);
    return getUrlParameter(queryParamStr);
  };

  /**
   * 功能:获得一个url中的参数
   * 参数:urlStr:url路径
   * 返回：如果没有参数则返回null 有参数则返回key：value形式的对象
   */
  var getUrlParameter = function(urlStr){
    var index = urlStr.indexOf("?");
    if(index > -1){
      index ++;
      urlStr = urlStr.substring(index,urlStr.length);
    }
    if(urlStr.indexOf("=") == -1){
      return {};
    }
    // 通过&拆分成数组name=value，保存为String类型数据
    var params = urlStr.split("&");
    if(params === null || params.length === 0){
      return {};
    }
    var paramObj = {};
    for(var i = 0; i < params.length; i ++){
      var keyValue = params[i].split("=");
      var key = keyValue[0];
      var value = params[i].replace(key + "=","");
      paramObj[key] = value;
    }
    return paramObj;
  };

  /**
   * 功能: 得到URL的参数值
   * 参数: paramName:参数名
   * 返回: 参数值
   */
  var getCurUrlParameterValue = function(paramName){
    var param = getCurUrlParameter();
    if(param == null){
      return "";
    }else{
      return param[paramName];
    }
  };

  ActivityStat.net = {};
  ActivityStat.net.getBrowser = getBrowser;
  ActivityStat.net.getMobileBrowser = getMobileBrowser;
  ActivityStat.net.getCurUrlParameter = getCurUrlParameter;
  ActivityStat.net.getUrlParameter = getUrlParameter;
  ActivityStat.net.getCurUrlParameterValue = getCurUrlParameterValue;
}(ActivityStat);

/*********************************************日期处理***********************************************/
+function (ActivityStat) {

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(D)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
   * Date()).pattern("YYYY-MM-DD hh:mm:ss.S") ==> 2006-07-02
   * 08:09:04.423 (new Date()).pattern("YYYY-MM-DD E HH:mm:ss") ==>
   * 2009-03-10 二 20:09:04 (new Date()).pattern("YYYY-MM-DD EE
   * hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
   * Date()).pattern("yyyy-MM-DD EEE hh:mm:ss") ==> 2009-03-10 星期二
   * 08:09:04 (new Date()).pattern("YYYY-M-D h:m:s.S") ==> 2006-7-2
   * 8:9:4.18
   */
  var formatDate = function(date,pattern){
    var o = {
      "M+" : date.getMonth()+1, // 月份
      "D+" : date.getDate(), // 日
      "h+" : date.getHours()%12 === 0 ? 12 : date.getHours()%12, // 小时
      "H+" : date.getHours(), // 小时
      "m+" : date.getMinutes(), // 分
      "s+" : date.getSeconds(), // 秒
      "q+" : Math.floor((date.getMonth()+3)/3), // 季度
      "S"  : date.getMilliseconds() // 毫秒
    };
    var week = {
      "0" : "/u65e5",
      "1" : "/u4e00",
      "2" : "/u4e8c",
      "3" : "/u4e09",
      "4" : "/u56db",
      "5" : "/u4e94",
      "6" : "/u516d"
    };
    if(/(Y+)/.test(pattern)){
      pattern = pattern.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(pattern)){
      pattern = pattern.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);
    }
    for(var k in o){
      if(new RegExp("("+ k +")").test(pattern)){
        pattern = pattern.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return pattern;
  };

  ActivityStat.date = {};
  ActivityStat.date.formatDate = formatDate;
}(ActivityStat);

/*********************************************调用思迪插件逻辑***********************************************/
// +function (ActivityStat) {
  // var tkuuid = ActivityStat.net.getCurUrlParameterValue("tkuuid");
  // if(tkuuid) {
  //   ActivityStat.storage.setSessionStorage('_tkuuid', tkuuid);
  // }

  // var callMessage = function(paramMap){
  //   var returnVal;
  //   try {
  //     paramMap = paramMap || {};
  //     var _tkuuid = ActivityStat.storage.getSessionStorage('_tkuuid');
  //     if(_tkuuid) {
  //       paramMap.tkuuid = _tkuuid;
  //     }
  //     var iBrowser = ActivityStat.net.getMobileBrowser();
  //     if(iBrowser.android && navigator.userAgent.indexOf("/thinkive_android") > 0){
  //       returnVal = window.external.callMessage(JSON.stringify(paramMap));
  //       if (returnVal && returnVal !== 'null' && typeof(returnVal) == "string"){
  //         returnVal = JSON.parse(returnVal);
  //       }

  //     }else if(iBrowser.ios && navigator.userAgent.indexOf("/thinkive_ios") > 0){
  //       var xhr = new  XMLHttpRequest();
  //       xhr.open("GET", window.location.protocol + "//" + window.location.host + "//js-invoke://external:callMessage:" + encodeURIComponent(JSON.stringify(paramMap)), false);
  //       xhr.send("");
  //       returnVal = JSON.parse(xhr.responseText);
  //     }
  //   }
  //   catch (e)
  //   {
  //   }
  //   return returnVal?returnVal:{};
  // };

  // ActivityStat.callMessage = callMessage;
// }(ActivityStat);

/*********************************************SDK业务封装***********************************************/
+function (ActivityStat) {
  var trafficOption;
  var init = function(option){
    trafficOption = ActivityStat.storage.getSessionStorage("trafficOption");
    if(ActivityStat.string.isNotEmpty(trafficOption)){
      trafficOption = ActivityStat.json.evalJSON(trafficOption) || {};
    }else{
      trafficOption = {};
    }
    option = option || {};
    var device_id = option.device_id;
    if(ActivityStat.string.isEmpty(device_id)){
      device_id = trafficOption.device_id;
    }

    if(ActivityStat.string.isEmpty(device_id)){
      device_id = ActivityStat.storage.getLocalStorage("device_id");
    }
    var suid = "";
    var user_type = "";
    var client_id = "";

    device_id = ActivityStat.uuid.getUUID();
    ActivityStat.storage.setLocalStorage("device_id",device_id);
    //授权签名key
    option.appKey = app_key;
    //设备号
    option.device_id = device_id;
    //活动ID
    if (!option.activity_id) {
      option.activity_id = ActivityStat.net.getCurUrlParameterValue("activity_id") || ActivityStat.net.getCurUrlParameterValue("utm_campaign") || trafficOption.activity_id || "";
    }
    //来源渠道：如：高财生APP，官方网站，百度推广，www.xxx.com...
    if (!option.utm_source) {
      option.utm_source = ActivityStat.net.getCurUrlParameterValue("utm_source") || trafficOption.utm_source || "";
    }
    //来源媒介：1-线上 2-线下
    if (!option.utm_medium) {
      option.utm_medium = ActivityStat.net.getCurUrlParameterValue("utm_medium") || trafficOption.utm_medium || "";
    }
    //来源的内容：如banner/卡片名称/广告ID...
    if (!option.utm_content) {
      option.utm_content = ActivityStat.net.getCurUrlParameterValue("utm_content") || trafficOption.utm_content || "";
    }
    //来源传入的活动ID，若落地页中没有指明活动ID,则使用此ID作为活动ID
    if (!option.utm_campaign) {
      option.utm_campaign = ActivityStat.net.getCurUrlParameterValue("utm_campaign") || trafficOption.utm_campaign || "";
    }
    //(可空)SUID，有则填写，SDK端需要持久化到本地
    option.suid = suid || trafficOption.suid || "";
    //用户类型：1-资金账号，2-微信，3-QQ，4-游客，5-手机号，6-员工账号
    option.user_type = user_type || trafficOption.user_type || "";
    //只取普通交易   账号（对应用户类型的唯一ID,游客则为设备ID）
    option.client_id = client_id || trafficOption.client_id || "";
    //ip
    option.ip = returnCitySN.cip || trafficOption.ip || "";
    //国家
    option.country = "" || trafficOption.country || "";
    var cname = returnCitySN.cname;
    var province = cname.split("省");
    //省份
    option.province = province[0] || trafficOption.province || "";
    //城市
    option.city = province[1].split("市")[0] || trafficOption.city || "";
    trafficOption = option;
    ActivityStat.storage.setSessionStorage('trafficOption', ActivityStat.json.toJSON(trafficOption));
  };

  //设置suid
  var setSuid = function(suid){
    var trafficOption = ActivityStat.storage.getSessionStorage("trafficOption");
    if(ActivityStat.string.isNotEmpty(trafficOption)){
      trafficOption = ActivityStat.json.evalJSON(trafficOption) || {};
    }else{
      trafficOption = {};
    }
    suid = suid;
    trafficOption.suid = suid; 
    ActivityStat.storage.setSessionStorage('trafficOption', ActivityStat.json.toJSON(trafficOption));
  }

  //设置user_type
  var setUserType = function(user_type){
    var trafficOption = ActivityStat.storage.getSessionStorage("trafficOption");
    if(ActivityStat.string.isNotEmpty(trafficOption)){
      trafficOption = ActivityStat.json.evalJSON(trafficOption) || {};
    }else{
      trafficOption = {};
    }
    user_type = user_type;
    trafficOption.user_type = user_type; 
    ActivityStat.storage.setSessionStorage('trafficOption', ActivityStat.json.toJSON(trafficOption));
  }

  //client_id
  var setClientId = function(client_id){
    var trafficOption = ActivityStat.storage.getSessionStorage("trafficOption");
    if(ActivityStat.string.isNotEmpty(trafficOption)){
      trafficOption = ActivityStat.json.evalJSON(trafficOption) || {};
    }else{
      trafficOption = {};
    }
    client_id = client_id;
    trafficOption.client_id = client_id; 
    ActivityStat.storage.setSessionStorage('trafficOption', ActivityStat.json.toJSON(trafficOption));
  }

  var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
      var t = "";
      var n, r, i, s, o, u, a;
      var f = 0;
      e = Base64._utf8_encode(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64
        } else if (isNaN(i)) {
          a = 64
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
      }
      return t
    },
    decode: function(e) {
      var t = "";
      var n, r, i;
      var s, o, u, a;
      var f = 0;
      e = e.replace(/[^A-Za-z0-9+/=]/g, "");
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = s << 2 | o >> 4;
        r = (o & 15) << 4 | u >> 2;
        i = (u & 3) << 6 | a;
        t = t + String.fromCharCode(n);
        if (u != 64) {
          t = t + String.fromCharCode(r)
        }
        if (a != 64) {
          t = t + String.fromCharCode(i)
        }
      }
      t = Base64._utf8_decode(t);
      return t
    },
    _utf8_encode: function(e) {
      e = e.replace(/rn/g, "n");
      var t = "";
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r)
        } else if (r > 127 && r < 2048) {
          t += String.fromCharCode(r >> 6 | 192);
          t += String.fromCharCode(r & 63 | 128)
        } else {
          t += String.fromCharCode(r >> 12 | 224);
          t += String.fromCharCode(r >> 6 & 63 | 128);
          t += String.fromCharCode(r & 63 | 128)
        }
      }
      return t
    },
    _utf8_decode: function(e) {
      var t = "";
      var n = 0;
      var r = c1 = c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode((r & 31) << 6 | c2 & 63);
          n += 2
        } else {
          c2 = e.charCodeAt(n + 1);
          c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          n += 3
        }
      }
      return t
    }
  }

  var getSignParam = function(param){
    trafficOption = trafficOption || {};
    param = param || {};
    var signParam = {};
    param = {
      "data": param
    };
    var jsonStr = JSON.stringify(param);
    jsonStr = Base64.encode(jsonStr);
    signParam["bizcode"] = "1302004";
    signParam["sign_type"] = "md5";
    signParam["charset"] = "utf8";
    signParam["format"] = "json";
    signParam["data"] = jsonStr;
    signParam["request_id"] = ActivityStat.uuid.getUUID();
    signParam["sdk_version"] = sdk_version;
    signParam["app_id"] = app_id;
    signParam["sign"] = trafficOption.appKey;
    signParam["timestamp"] = new Date().getTime().toString();
    var args = ["app_id","bizcode","format","request_id","sdk_version","sign","sign_type","timestamp"];
    var sign = "";
    for (var i = 0; i < args.length; i ++)
    {
      var key = args[i];
      var value = signParam[key];
      if (i == args.length - 1) {
        sign += (key + "=" + value);
      } else {
        sign += (key + "=" + value + "&");
      }
    }

    signParam["sign"] = ActivityStat.md5.hex_md5(sign);
    return signParam;
  };


  var setCurrentPageName = function(pageName){
    var curPageObject = {};
    curPageObject.pageName = pageName || "";
    curPageObject.date = ActivityStat.date.formatDate(new Date(),"YYYY-MM-DD");
    //保存session
    window.sessionStorage.setItem("cur_page_name_obj", ActivityStat.json.toJSON(curPageObject));
    // ActivityStat.storage.setSessionStorage("cur_page_name_obj", ActivityStat.json.toJSON(curPageObject));
  };

  var getCurrentPageObject = function(){
    var cur_page_name_obj = ActivityStat.storage.getSessionStorage("cur_page_name_obj");
    if(ActivityStat.string.isNotEmpty(cur_page_name_obj)){
      return ActivityStat.json.evalJSON(cur_page_name_obj) || {};
    }
    return {};
  };

  var getCurrentPageName = function(){
    var cur_page_name_obj = window.sessionStorage.getItem("cur_page_name_obj");
    if(ActivityStat.string.isNotEmpty(cur_page_name_obj)){
      var curPageObject = ActivityStat.json.evalJSON(cur_page_name_obj);
      return curPageObject.pageName;
    } else {
      return "";
    }
  };

  // var setFromPageName = function(pageName){
  //   ActivityStat.storage.setSessionStorage("from_page_name",pageName);
  // };
  //
  // var getFromPageName = function(){
  //   return ActivityStat.storage.getSessionStorage("from_page_name") || "";
  // };

  var getCommonParam = function(){
    trafficOption = ActivityStat.storage.getSessionStorage("trafficOption");
    if(ActivityStat.string.isNotEmpty(trafficOption)){
      trafficOption = ActivityStat.json.evalJSON(trafficOption) || {};
    }else{
      trafficOption = {};
    }
    var param = {};
    var currentDate = new Date();
    //活动id
    param["activity_id"] = trafficOption.activity_id || "";
    //操作日期
    param["operate_date"] = ActivityStat.date.formatDate(currentDate,"YYYY-MM-DD HH:mm:ss");
    //时间戳
    param["time_stamp"] = currentDate.getTime() + "";
    //设备号
    param["device_id"] = trafficOption.device_id || "";
    //(可空)SUID，有则填写，SDK端需要持久化到本地
    param["suid"] = trafficOption.suid || "";
    //用户类型：1-资金账号，2-微信，3-QQ，4-游客，5-手机号，6-员工账号
    param["user_type"] = trafficOption.user_type || "";
    //账号（对应用户类型的唯一ID,游客则为设备ID）
    param["client_id"] = trafficOption.client_id || "";
    //来源渠道
    param["utm_source"] = trafficOption.utm_source || "";
    //来源媒介
    param["utm_medium"] = trafficOption.utm_medium || "";
    //来源的内容
    param["utm_content"] = trafficOption.utm_content || "";
    //来源传入的活动ID
    param["utm_campaign"] = trafficOption.utm_campaign || "";
    //当前页面
    param["page_name"] = "";
    //来源页面
    param["from_page_name"] = "";
    //ip
    param["ip"] = trafficOption.ip || "";
    //国家
    param["country"] = trafficOption.country || "";
    //省份
    param["province"] = trafficOption.province || "";
    //城市
    param["city"] = trafficOption.city || "";
    return param;
  };

  var visitPage = function(page_name,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10){
    var param = getCommonParam();
    var fromPageObject = getCurrentPageObject();
    if(fromPageObject && fromPageObject.date){
      var fromPageDate = fromPageObject.date;
      var currentPageDate = ActivityStat.date.formatDate(new Date(),"YYYY-MM-DD");
      if(fromPageDate == currentPageDate){
        //来源页面
        param["from_page_name"] = fromPageObject.pageName || "";
      }
    }
    param["action_id"] = "101";
    //1:页面访问 2:页面点击
    param["operate_type"] = "1";
    param["operate_name"] = "进入页面";
    //当前页面
    param["page_name"] = page_name || "";
    param["s1"] = s1 || "";
    param["s2"] = s2 || "";
    param["s3"] = s3 || "";
    param["s4"] = s4 || "";
    param["s5"] = s5 || "";
    param["s6"] = s6 || "";
    param["s7"] = s7 || "";
    param["s8"] = s8 || "";
    param["s9"] = s9 || "";
    param["s10"] = s10 || "";
    if(debuggerEnable){
      console.log("统计页面访问："+page_name+"。参数：" + ActivityStat.json.toJSON(param));
    }
    sendServer(param,function(response){
      if(debuggerEnable){
        console.log("统计页面访问返回：" + ActivityStat.json.toJSON(response));
      }
    });
    //保存前面一个页面
    // setFromPageName(param["from_page_name"]);
    //保存当前页面
    setCurrentPageName(page_name);
  };

  var event = function(operate_name,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10){
    var param = getCommonParam();
    //来源页面
    // param["from_page_name"] = getFromPageName() || "";
    param["from_page_name"] = "";
    //当前页面
    param["page_name"] = getCurrentPageName() || "";
    param["action_id"] = "101";
    //1:页面访问 2:页面点击
    param["operate_type"] = "2";
    param["operate_name"] = operate_name || "";
    param["s1"] = s1 || "";
    param["s2"] = s2 || "";
    param["s3"] = s3 || "";
    param["s4"] = s4 || "";
    param["s5"] = s5 || "";
    param["s6"] = s6 || "";
    param["s7"] = s7 || "";
    param["s8"] = s8 || "";
    param["s9"] = s9 || "";
    param["s10"] = s10 || "";
    if(debuggerEnable){
      console.log("统计事件点击："+operate_name+"。参数：" + ActivityStat.json.toJSON(param));
    }
    sendServer(param,function(response){
      if(debuggerEnable){
        console.log("统计事件点击返回：" + ActivityStat.json.toJSON(response));
      }
    });
  };

  var sendServer = function(param,callback){
    if(param){
      var data = [param];
      var signParam = getSignParam(data);
      ActivityStat.ajax(server_url,signParam,"post",callback);
    }
  };

  ActivityStat.init = init;
  ActivityStat.setSuid = setSuid;
  ActivityStat.setUserType = setUserType;
  ActivityStat.setClientId = setClientId;
  ActivityStat.visitPage = visitPage;
  ActivityStat.event = event;
}(ActivityStat);

export default ActivityStat;