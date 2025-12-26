# Python 3.9을 기반으로 하는 공식 이미지를 사용합니다.
FROM python:3.9-slim

# 작업 디렉토리를 /app 으로 설정합니다.
WORKDIR /app

# requirements.txt를 복사하고 라이브러리를 설치합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 백엔드 폴더의 모든 파일을 컨테이너의 /app 디렉토리로 복사합니다.
COPY . .

# 컨테이너가 시작될 때 uvicorn 서버를 실행하는 명령어를 지정합니다.
# 0.0.0.0 호스트를 사용해 외부에서 접근 가능하게 하고, Cloud Run이 지정하는 포트를 사용합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
