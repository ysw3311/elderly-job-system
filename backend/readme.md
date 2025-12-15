# backend 파트 부분 설정

## backend 폴더에서 먼저 실행 되어야 함.
cd backend

## 가상환경 생성
python -m venv venv

만약 안된다면,
py -m venv venv

## vevn 실행
.\venv\Scripts\activate

## 가상환경 활성화 (Mac/Linux)
source venv/bin/activate

## venv 실행이 안된다면, 
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

## 라이브러리 설치
pip install -r requirements.txt

만약 안된다면,
pip install flask flask-sqlalchemy flask-cors pymysql cryptography

## 이곳에서 파이썬 먼저 실행 후, elderly-job-system 폴더에서 npm run dev 하면 됨. (app.py는 돌아가고 있어야 함. 중단해서는 안됨.)
python .\app.py 

### 아직 DB 설계가 어떻게 마무리 되었는지 확인이 안되어서 임의로 DB를 넣어둔 상태, 추후 완전한 DB를 확인하면, 그에 맞춰서 코드 요수정
일
예시 데이터 DB는 senior_job_db.txt로 저장했음. mysql에서 작업을 했으며 app.py의 11번째 줄 코드를 잘 확인할 것. 이 파일은 erd스키마를 통해서 만든 파일