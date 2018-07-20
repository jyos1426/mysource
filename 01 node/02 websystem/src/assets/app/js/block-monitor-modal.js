//== Class definition

var BlockMonitorBlock = function () {
  
  //== Private functions
  var init = function () {
      // minimum setup
      // $('#input_protocol').selectpicker();
      // $('#input_protocol, #input_block_mode, #input_air_test').select2();
  }

  var initSelectbox = function() {
    $('#modal_block_monitor_add').on('shown.bs.modal', function() {
      // $('#input_protocol, #input_block_mode, #input_air_test').selectpicker();
      // $('#input_protocol, #input_block_mode, #input_air_test').select2();
      $('#input_protocol_1').selectpicker();
      $('#input_protocol_2').select2();
    });
  }

  return {
      // public functions
      init: function() {
        initSelectbox();
      }
  };
}();

jQuery(document).ready(function() {    
  BlockMonitorBlock.init();
});