# Chessboard Exercise #


Create a simple API to support a chessboard

see requirements.txt for more detail

reference: http://en.wikipedia.org/wiki/Algebraic_chess_notation


## INSTALLATION ##

Install NodeJS - refer http://nodejs.org/

### Install express ###
npm install express


Testing Framework

npm install expresso

## Running ##

Development

$ nodejs d.js app.js

This will autostart express each time a file is changed


## API ##
### New Game ###
clears any existing game and resets the board pieces

method: delete (may just use get for simplicity of browser access)

url: /reset

#### Returns ####
success: 200

note: Board will be created automatically if any of the bellow methods are called


### Return Entire Board ###
returns - entire board with pieces locations

method: get

url: /

success: 200
json formatted
{
  a1: "WR",
  b2: "WN",
  ...
  g8: "BN",
  h8: "BR"
}


### Return Location ###
Returns a single cell on the chess board

method: get

url: /show/:loc

:loc is based on chessboard notation

valid value options are [a..h][1..8]

valid: 200

{ a1: "" }, if no piece on square

or

{ a1: "WR" }

invalid: 400


### Move piece ###
Move a piece from one position to another

method: put (may just use get for simplicity of browser access)

url: /move/:from/:to

valid value options for :from & :to are [a..h][1..8]

valid: 200

{ removed: "WK" } or piece value or empty string

invalid: 400

