import './App.css';
import {useEffect, useRef, useState} from "react";
import BitcoinIcon from "./assets/bitcoin";

function App() {
    const ws = useRef(null);
    const [price, setPrice] = useState(null)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const connectWS = () => {
        ws.current = new WebSocket('wss://ws.bitmex.com/realtime?subscribe=orderBookL2_25:XBTUSD');

        ws.current.onopen = () => {
            console.log('Connected to the WebSocket server');
        };

        ws.current.onmessage = (event) => {
            console.log('When WebSocket server sends message');
            const allMessages = JSON.parse(event.data);
            if (allMessages?.data && allMessages?.data.length > 0) {
                setPrice(formatter.format(allMessages?.data[0].price))
            }
        };

        ws.current.onclose = () => {
            console.log('Disconnected from the WebSocket server');
        };

        return () => {
            ws.current.close();
        };
    }
    useEffect(() => {
        connectWS()
    }, []);

    return (
        <div className="App">
            <h1>Real Time Bitcoin Price</h1>
            <BitcoinIcon/>
            <h2>{price}</h2>
        </div>
    );
}

export default App;
