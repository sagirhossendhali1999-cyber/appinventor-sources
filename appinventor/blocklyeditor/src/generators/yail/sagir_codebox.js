Blockly.Yail['add_source_directly'] = function() {
    var code = Blockly.Yail.valueToCode(this, 'CODE', Blockly.Yail.ORDER_NONE);
      var raw = code.slice(1, -1);
        return raw + '\n';
        };