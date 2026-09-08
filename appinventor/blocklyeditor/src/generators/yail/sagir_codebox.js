Blockly.Yail['add_source_directly'] = function() {
      var code = Blockly.Yail.valueToCode(this, 'CODE', Blockly.Yail.ORDER_NONE);
        return code + '\n';
        };