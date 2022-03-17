# Getting Started with Create React App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server

### `npm test`

Runs all of the tests

### `npm run build`

Builds the app for production to the `build` folder.


## Testing WebSocket connectivity (3/17/22)

from the test_server directory, open a test 
WebSocket connection:

### `npm websocket.js`

once you run the website script and navigate to the terminal webpage, 
you can type and send user input which will then be received and 
"echoed" back by the test connection, confirming the handshake.

Things you currently cannot do:

- use native hotkeys for your browser while on the terminal page
- delete/backspace your current input string
- "up-arrow" previously used commands
- arrow keys successfully move the cursor, but does not scroll 
  the terminal window back to previous entries and causes
  input overlap, terminal output, and other terminal orientation
  errors.


