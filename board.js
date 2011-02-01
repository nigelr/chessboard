var fs = require('fs');

module.exports = {
  pieces: {}

  , create: function () {
    this.buildBackRow("1", "W");
    this.buildPawnRow("2", "W");
    for (var col = 3; col <= 6; col ++) {
      this.buildBlankRow(col)
    }
    this.buildPawnRow("7", "B");
    this.buildBackRow("8", "B");
    this.save();
    return this.pieces;
  }

  , buildBackRow: function (row, color) {
    for (var col = 0; col < 8; col ++) {
      this.pieces[this.col_labels[col] + row] = color + this.row_pieces[col];
    }
  }

  , buildPawnRow: function (row, color) {
    for (var col = 0; col < 8; col ++) {
      this.pieces[this.col_labels[col] + row] = color + "P";
    }
  }

  , buildBlankRow: function (row) {
    for (var col = 0; col < 8; col ++) {
      this.pieces[this.col_labels[col] + row] = "";
    }
  }
  , col_labels: ["a", "b", "c", "d", "e", "f", "g", "h"]
  , row_pieces: ["R", "N", "B", "Q", "K", "B", "N", "R"]
  , save: function () {
    fs.writeFileSync("board.hash", JSON.stringify(this.pieces));
  }
  , load: function (callback) {
    fs.readFile('board.hash', function(err,data) {
      if (err) {
        console.log("Missing");
        createBoardFile(); }
      else {
        this.pieces = JSON.parse(data);
        callback();

      }
    });

  }
};
