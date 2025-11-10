import { SerialPort, ReadlineParser } from 'serialport';
import { WebSocketServer } from 'ws';

const SERIAL_PORT_PATH = '/dev/cu.usbmodem14302'; // 사용자의 포트 경로
const BAUD_RATE = 115200;
const WEBSOCKET_PORT = 8080;

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

console.log(`WebSocket server started on port ${WEBSOCKET_PORT}`);

const port = new SerialPort({
    path: SERIAL_PORT_PATH,
    baudRate: BAUD_RATE,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
    console.log(`Serial port ${SERIAL_PORT_PATH} opened`);
});

port.on('error', (err) => {
    console.error('Serial port error: ', err.message);
    console.log('---');
    console.log('ERROR: Serial port not found.');
    console.log('Please check SERIAL_PORT_PATH in server.js');
    console.log('You can find the port path in the Arduino IDE (Tools > Port)');
    console.log('---');
    process.exit(1);
});

// (1) 아두이노 -> React (센서 데이터 전송)
parser.on('data', (data) => {
    // 'USE_SPI' 같은 부팅 메시지 거르기
    if (data.startsWith('{')) {
        console.log('Data to React:', data);
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // 1 == WebSocket.OPEN
                client.send(data);
            }
        });
    } else {
        console.log('Ignored non-JSON data:', data);
    }
});


wss.on('connection', (ws) => {
    console.log('React client connected');

    // [수정됨] (2) React -> 아두이노 (조명 명령 수신)
    // 이 핸들러가 빠져있었습니다.
    ws.on('message', (message) => {
        try {
            const cmd = JSON.parse(message);
            // React가 보낸 {"command":"light","value":"L1"} 같은 객체 처리
            if (cmd.command && cmd.value) {
                // "L1\n" 또는 "B178\n" 같은 문자열 생성
                const commandString = `${cmd.value}\n`;

                // [로그] 이 로그가 보여야 합니다.
                console.log('Data to Arduino:', commandString);

                // 아두이노 시리얼 포트로 명령 전송
                port.write(commandString);
            }
        } catch (e) {
            console.error('Failed to parse message from React:', message.toString());
        }
    });

    ws.on('close', () => {
        console.log('React client disconnected');
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

