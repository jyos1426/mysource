exports.execute = ( type, val, subType = '' ) => {
  switch (type) {
    case 'id':
      var regExChar = /^[a-zA-Z0-9]{5,9}$/;
      break;
    case 'password':
      var regExChar = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,12}$/;
      break;
    case 'email':
      var regExChar = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
      break;
    case 'phone':
      var regExChar = /^\d{3}-\d{3,4}-\d{4}$/;
      break;
    case 'ipv4':
      var regExChar = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      break;
    case 'prefixV4':
    var regExChar = /^((?:[1-9])|(?:[1-2][0-9])|(?:3[0-2]))$/;
      break;
    case 'prefixV6':
    var regExChar = /^((?:[1-9])|(?:[1-9][0-9])|(?:1[0-2][0-8])|(?:12[0-8]))$/;
      break;
    case 'date':
      switch (subType) {
        case 'yyyymmddhhmmss':
          var regExChar = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([1-9]|[01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/;
          break;
        case 'yyyymmddhhmm':
          var regExChar = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([1-9]|[01][0-9]|2[0-3])([0-5][0|5])$/;
          break;
        default:
          return false;
      }
      break;        
    default:
      return false;
  }

  if (regExChar.test(val)) {
    return true;
  } else {
    return false;
  }
}