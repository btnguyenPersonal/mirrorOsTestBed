import React, { useEffect } from 'react'
import { XTerm } from 'xterm-for-react'
 
function Terminal() {
    const XTermRef = React.useRef();
    const XTermOpt = {
        cursorBlink:true
    }

    let messageString = "";

    const prompt = (firstLine) => {
        if(firstLine)
            XTermRef.current.terminal.write('$ ');
        else
            XTermRef.current.terminal.write('\r\n$ ');
    };

    const onKey = (event) => {
        if(event.key === '\r') {
            prompt(false);
            //send through websocket
            messageString = "";
        }

        else {
            console.log(event.key);
            messageString += event.key;
            XTermRef.current.terminal.write(event.key);
        }
    };

    React.useEffect(() => {
        //initialize websocket
        prompt(true);
    });

    //websocket on message

    let content = (
        <div>
            <XTerm
                ref = { XTermRef }
                options = { XTermOpt }
                onKey = { onKey } 
            />
        </div>
    );

    return content;
}

export default Terminal;