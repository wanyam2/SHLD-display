# SHLD-display

실내 조명/점유/공기질 상태를 보여주고 MQTT 명령을 주고받는 React(Vite) 프로젝트입니다. 다른 사람이 내려받아 바로 실행할 수 있도록 설치·실행 방법을 정리했습니다.

## 요구 사항
- Node.js 18 이상
- 패키지 매니저: pnpm 9 권장 (pnpm-lock.yaml 포함), npm 10도 사용 가능

## 빠른 시작
```bash
git clone <repository-url>
cd shld-display
pnpm install
```

### 환경 변수 설정
MQTT 브로커 연결 정보를 `.env.local`(또는 `.env`)에 넣어주세요.
```bash
VITE_MQTT_URL=ws://your-mqtt-host:port
VITE_MQTT_USERNAME=your-username     # 옵션
VITE_MQTT_PASSWORD=your-password     # 옵션
VITE_DEVICE_ID=uno01                 # 기본값: uno01
```

### 개발 서버 실행
```bash
pnpm dev  
```
브라우저에서 터미널에 표시된 로컬 주소로 접속합니다.

### 프로덕션 빌드 / 미리보기
```bash
pnpm build  
pnpm preview 
```

## (선택) 센서 브릿지 서버 사용하기
`src/sensor-server`는 시리얼(아두이노) 데이터를 웹소켓으로 전달하는 간단한 노드 서버입니다.
```bash
cd src/sensor-server
pnpm install   
# server.js 안의 SERIAL_PORT_PATH를 로컬 포트로 수정
pnpm start     
```

## 문제 해결
- MQTT URL이 비어 있으면 앱이 연결 오류를 표시합니다. `.env.local`을 다시 확인하세요.
- 센서 브릿지를 쓸 때 포트 경로가 맞지 않으면 서버가 즉시 종료합니다. 아두이노 IDE의 `Tools > Port`에서 경로를 확인 후 `server.js`를 수정하세요.

