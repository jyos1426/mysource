var ip = require('ip');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var path = require('path');
//유틸성 함수들 

exports.cidrToNetworkInteger = (v) => {
	return ip.toLong(ip.fromPrefixLen(v));
}

isIPv4 = (v) => {	
	return v.indexOf('.') >= 0;
};

//ipv4 int => prefix 
exports.ipToPrefix = (v) => {
	var subnet = ip.fromLong(v);
	var maskBuffer = ip.toBuffer(subnet);
	var maskLength = 0;

	for (var i = 0; i < maskBuffer.length; i++) {
    if (maskBuffer[i] === 0xff) {
      maskLength += 8;
    } else {
      var octet = maskBuffer[i] & 0xff;
      while (octet) {
        octet = (octet << 1) & 0xff;
        maskLength++;
      }
    }
  };

	return String(maskLength);
}

exports.parseIP = (v) => {
	if (isIPv4(v)) return v.split(':')[0];		
	else return v.split(']')[0].replace('[', '');	
};

exports.parsePort = (v) => {
	if (isIPv4(v)) return v.split(':')[1];		
	else 				return v.split(']:')[1];
};

//network/prefix 의 시작주소(델파이 기준으로 맞춤)
exports.getStartIP = (network, prefix) => {		
	if (isIPv4(network)) {
		var subnet = ip.subnet(network, ip.fromPrefixLen( prefix));
		return ip.toLong(subnet['networkAddress']);
	} else {
		var buf = ip.toBuffer(network);
		for(var bit = prefix; bit <= 127; bit++) {
			buf[parseInt(bit/8)] = buf[parseInt(bit/8)] & (255 ^ (1 << (7-(bit % 8))));
		}
		return this.ipv6ToFullStr(ip.toString(buf));
	}	
}

//network/prefix 의 마지막 주소(델파이 기준으로 맞춤)
exports.getEndIP = (network, prefix) => {
	if (isIPv4(network)) {
		var subnet = ip.subnet(network, ip.fromPrefixLen( prefix));
		return ip.toLong(subnet['broadcastAddress']);
	} else {
		var buf = ip.toBuffer(network);
		for(var bit = prefix; bit <= 127; bit++) {			
			buf[parseInt(bit/8)] = buf[parseInt(bit/8)] | (1 << (7-(bit % 8)));
		}
		return this.ipv6ToFullStr(ip.toString(buf));
	}
}

prependZero = (num, len) => {	
	while(num.toString().length < len) {
	    num = "0" + String(num);
	}	
	return num;
}

//ipv6 network를 full network로 변환
exports.ipv6ToFullStr = (network) => {
	if (isIPv4(network)) return network;

	var buf = ip.toBuffer(network);	
	var i = 0;	
	var res = '';	
	while (i < buf.length) {		
		var tmp = buf.slice(i,i+2);		
		res += prependZero(tmp.readUInt16BE().toString(16), 4) + ':';
		i += 2;	
	}
	res = res.substring(0, res.length-1);	
	return res;	
}

//파일생성
exports.saveToJsonFile = (filepath, jsonDatas) => {
	//폴더 없으면 생성
	if (!fs.existsSync(path.dirname(filepath))) 
		fs.mkdirSync(path.dirname(filepath));

	//JSON을 스트링으로 변환
	var datas = JSON.stringify(jsonDatas);

	//쓰기
	fs.writeFile(filepath, datas, (err) => {
		if (err) console.log(err);
	});
}

//byte단위변환
exports.byteToStr = (value, max) => {

	var value = Math.abs(value);       // y축 숫자
	var unit = ''; // 단위
	var valuemax = max;

	if (max < Math.pow(10,3)){
		unit = 'B';
	} else if(max >= Math.pow(10,3) && max < Math.pow(10,6)) {
		value /= Math.pow(10,3);
		valuemax /= Math.pow(10,3);
		unit = 'K';
	} else if(max >= Math.pow(10,6) && max < Math.pow(10,9)) {
		value /= Math.pow(10,6);
		valuemax /= Math.pow(10,6);
		unit = 'M';
	} else if(max >= Math.pow(10,9) && max < Math.pow(10,12)) {
		value /= Math.pow(10,9);
		valuemax /= Math.pow(10,9);
		unit = 'G';
	} else if(max >= Math.pow(10,12) && max < Math.pow(10,15)) {
		value /= Math.pow(10,12);
		valuemax /= Math.pow(10,12);
		unit = 'T';
	} else if (max >= Math.pow(10,15) && max < Math.pow(10,18)){
		value /= Math.pow(10,15);
		valuemax /= Math.pow(10,15);
		unit = 'P';
	} else if (max >= Math.pow(10,18)){
		value /= Math.pow(10,18);
		valuemax /= Math.pow(10,18);
		unit = 'E';
	}

	if(valuemax < 10 && valuemax != 0) {
		value = parseFloat(value.toFixed(2));
	} else {
		value = value.toFixed(0);
	}

	var res = value + ' ' + unit;
	return res;
}

exports.fileTree = (basepath, extensions) => {
    var _fileTree = (name, extensions) => {
        var stats = fs.statSync(name);
        var item = {
            path: path.relative(basepath, name),
            size: this.byteToStr(stats["size"], 2),
            name: path.basename(name)
        };

        if (stats.isFile()) {
            if (extensions &&
                extensions.length > 0 &&
                extensions.indexOf(path.extname(name).toLowerCase()) == -1) {
                return null;
            }
            item.type = 'file';
        } else {
            item.type = 'directory';
            item.list = fs.readdirSync(name).map(function (child) {
                return _fileTree(path.join(name, child), extensions);
            }).filter(function (e) {
                return e != null;
            });

            if (item.list.length == 0) {
                return null;
            }
        }

        return item;
    }
    return _fileTree(basepath, extensions);
}