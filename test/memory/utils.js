var humanize = require('humanize');
var mod_tab = require('tab');
var out = new mod_tab.TableOutputStream({
    'columns': [
      {'label':'component', 'width': 30},
      {'label':'run', 'width': 4, 'align': 'right'},
      {'label':'node delta', 'width': 11, 'align': 'right'},
      {'label':'heap delta', 'width': 15, 'align': 'right'},
      {'label':'event listener', 'width': 15, 'align': 'right'},
  ], 'columnSeparator': ' | ',
});

module.exports = {
  heapDiffPrinter: function(after, initial, i, title) {
    out.writeRow([
      title ,
      (i + 1) ,
      after.counts.nodes - initial.counts.nodes,
      humanize.filesize(after.counts.jsHeapSizeUsed - initial.counts.jsHeapSizeUsed),
      after.counts.jsEventListeners - initial.counts.jsEventListeners,
    ]);
  }
};
