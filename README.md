# Swing Stock Checker

스윙기타 B-stock 몰의 재고를 체크하는 프로그램입니다.

## Backend

### 로컬에서 실행하기

#### 1. 가상 환경 설정 및 활성화

Python 가상 환경을 생성하고 활성화합니다.

```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### 2. 의존성 설치

`requirements.txt` 파일에 명시된 라이브러리들을 설치합니다.

```bash
pip install -r requirements.txt
```

#### 3. FastAPI 서버 실행

Uvicorn을 사용하여 FastAPI 애플리케이션을 실행합니다.

```bash
uvicorn main:app --reload
```

서버는 `http://127.0.0.1:8000` 에서 실행됩니다.

### Docker로 실행하기

#### 1. Docker 이미지 빌드

프로젝트 루트의 `backend` 디렉토리에서 다음 명령어를 실행하여 Docker 이미지를 빌드합니다.

```bash
docker build -t swing-stock-checker-backend .
```

#### 2. Docker 컨테이너 실행

빌드된 이미지를 사용하여 Docker 컨테이너를 실행합니다.

```bash
docker run -p 8080:8080 swing-stock-checker-backend
```

서버는 `http://localhost:8080` 에서 실행됩니다.

## Frontend

프론트엔드를 실행하기 위해서는 백엔드 서버가 먼저 실행되어 있어야 합니다.

### 로컬에서 실행하기

1.  `frontend` 디렉토리로 이동합니다.

    ```bash
    cd frontend
    ```

2.  Python의 내장 웹 서버를 사용하여 프론트엔드 파일을 서비스합니다. 포트 8000번은 백엔드에서 사용하므로, 다른 포트(예: 8001)를 사용합니다.

    ```bash
    python3 -m http.server 8001
    ```

3.  웹 브라우저를 열고 `http://localhost:8001` 로 접속합니다.
