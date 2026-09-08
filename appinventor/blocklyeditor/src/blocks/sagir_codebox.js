Blockly.Blocks['add_source_directly'] = {
      init: function() {
          this.appendValueInput("CODE")
                  .setCheck("String")
                          .appendField("add source directly");
                              this.setPreviousStatement(true, null);
                                  this.setNextStatement(true, null);
                                      this.setColour(260);
                                          this.setTooltip("SAGIR CODE BOX");
                                            }
                                            };
}