from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)

# DB 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost/senior_job_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# --- Models (ERD 기반) ---

class Senior(db.Model):
    __tablename__ = 'seniors'
    senior_id = db.Column(db.String(255), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(10))
    address = db.Column(db.String(255))
    restricted_activities = db.Column(db.Text)
    # 선호 근무 조건
    employment_type = db.Column(db.String(50))
    location = db.Column(db.String(255))
    work_days = db.Column(db.String(50))
    work_hours = db.Column(db.String(50))
    work_period = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.senior_id,
            'username': self.senior_id, # 프론트 호환용
            'name': self.name,
            'role': 'senior',
            'phone': self.phone,
            'address': self.address,
            'preferences': {
                'workLocation': self.location,
                'jobType': 'both' # 임시 값
            }
        }

class Company(db.Model):
    __tablename__ = 'company'
    company_id = db.Column(db.String(255), primary_key=True)
    company_pw = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    business_number = db.Column(db.String(255))
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.company_id,
            'username': self.company_id, # 프론트 호환용
            'name': self.name,
            'role': 'company',
            'business_number': self.business_number,
            'address': self.address,
            'phone': self.phone
        }

class Government(db.Model):
    __tablename__ = 'government'
    gov_id = db.Column(db.String(255), primary_key=True)
    gov_password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100))
    tel = db.Column(db.String(20))
    department = db.Column(db.String(100))
    email = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.gov_id,
            'username': self.gov_id, # 프론트 호환용
            'name': self.name,
            'role': 'government',
            'department': self.department
        }

class JobPosting(db.Model):
    __tablename__ = 'jobposting'
    job_id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(255))
    job_description = db.Column(db.Text)
    location = db.Column(db.String(255))
    employment_type = db.Column(db.String(50))
    work_days = db.Column(db.String(50))
    work_hours = db.Column(db.String(50))
    work_period = db.Column(db.String(50))
    wage_type = db.Column(db.String(20)) # 시급/일급 등
    wage_amount = db.Column(db.Integer)
    posted_at = db.Column(db.Date, default=datetime.utcnow)
    deadline_date = db.Column(db.Date)
    status_name = db.Column(db.String(50), default='pending_approval')
    
    # 외래키
    company_id = db.Column(db.String(255), db.ForeignKey('company.company_id'))
    gov_id = db.Column(db.String(255), db.ForeignKey('government.gov_id'), nullable=True)

    # 관계 설정
    company = db.relationship('Company', backref='jobs')
    government = db.relationship('Government', backref='approved_jobs')

    def to_dict(self):
        return {
            'id': self.job_id,
            'company_id': self.company_id,
            'company_name': self.company.name if self.company else "Unknown",
            'title': self.job_title,
            'description': self.job_description,
            'location': self.location,
            'employment_type': self.employment_type,
            'wage_amount': self.wage_amount,
            'work_days': self.work_days,
            'work_hours': self.work_hours,
            'work_period': self.work_period,
            'deadline': self.deadline_date.strftime('%Y-%m-%d') if self.deadline_date else None,
            'status': self.status_name,
            'government_approved': True if self.status_name == 'approved' else False
        }

class Application(db.Model):
    __tablename__ = 'applications'
    application_id = db.Column(db.Integer, primary_key=True)
    application_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='submitted')
    notes = db.Column(db.Text)
    
    senior_id = db.Column(db.String(255), db.ForeignKey('seniors.senior_id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobposting.job_id'))

    senior = db.relationship('Senior', backref='applications')
    job = db.relationship('JobPosting', backref='applications')

    def to_dict(self):
        return {
            'id': self.application_id,
            'job_id': self.job_id,
            'senior_id': self.senior_id,
            'senior_name': self.senior.name,
            'job_title': self.job.job_title,
            'status': self.status,
            'application_date': self.application_date.strftime('%Y-%m-%d')
        }

class EmploymentHistory(db.Model):
    __tablename__ = 'employmenthistory'
    history_id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, default=datetime.utcnow)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), default='active')
    verified_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    application_id = db.Column(db.Integer, db.ForeignKey('applications.application_id'))
    
    # 간편한 조회를 위한 관계 설정
    application = db.relationship('Application', backref='history')

    def to_dict(self):
        # Application을 통해 senior, job, company 정보에 접근
        app_obj = self.application
        job_obj = app_obj.job
        company_obj = job_obj.company

        return {
            'id': self.history_id,
            'senior_id': app_obj.senior_id,
            'job_id': job_obj.job_id,
            'company_id': company_obj.company_id,
            'company_name': company_obj.name,
            'job_title': job_obj.job_title,
            'start_date': self.start_date.strftime('%Y-%m-%d') if self.start_date else None,
            'end_date': self.end_date.strftime('%Y-%m-%d') if self.end_date else None,
            'status': self.status,
            'verified': True
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendation'
    recommendation_id = db.Column(db.Integer, primary_key=True)
    compatibility_score = db.Column(db.Float)
    senior_id = db.Column(db.String(255), db.ForeignKey('seniors.senior_id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobposting.job_id'))

# --- Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 1. 시니어 테이블 조회
    senior = Senior.query.filter_by(senior_id=username, password=password).first()
    if senior:
        return jsonify({'success': True, 'user': senior.to_dict()})

    # 2. 기업 테이블 조회
    company = Company.query.filter_by(company_id=username, company_pw=password).first()
    if company:
        return jsonify({'success': True, 'user': company.to_dict()})

    # 3. 정부 테이블 조회
    gov = Government.query.filter_by(gov_id=username, gov_password=password).first()
    if gov:
        return jsonify({'success': True, 'user': gov.to_dict()})

    return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 틀렸습니다.'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    role = data.get('role')
    username = data.get('username')
    
    # ID 중복 체크 (모든 테이블 검사)
    if (Senior.query.get(username) or Company.query.get(username) or Government.query.get(username)):
        return jsonify({'success': False, 'message': '이미 존재하는 아이디입니다.'}), 400

    try:
        if role == 'senior':
            # 시니어 선호조건 파싱
            prefs = json.loads(data.get('preferences', '{}')) if isinstance(data.get('preferences'), str) else data.get('preferences', {})
            
            new_user = Senior(
                senior_id=username,
                password=data['password'],
                name=data['name'],
                phone=data.get('phone'),
                location=prefs.get('workLocation', ''), # 선호 근무지를 location에 저장
                # 기타 필드는 기본값 또는 null
            )
            db.session.add(new_user)

        elif role == 'company':
            info = data.get('companyInfo', {})
            new_user = Company(
                company_id=username,
                company_pw=data['password'],
                name=data['name'],
                phone=data.get('phone'),
                business_number=info.get('businessNumber'),
                address=info.get('address')
            )
            db.session.add(new_user)
        
        # 정부는 회원가입 없다고 가정 (초기 데이터로만 존재)

        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'success': False, 'message': '회원가입 처리 중 오류 발생'}), 500

@app.route('/api/jobs', methods=['GET', 'POST'])
def handle_jobs():
    if request.method == 'GET':
        jobs = JobPosting.query.all()
        return jsonify([job.to_dict() for job in jobs])
    
    if request.method == 'POST':
        data = request.json
        new_job = JobPosting(
            company_id=data['company_id'],
            job_title=data['title'],
            job_description=data['description'],
            location=data['location'],
            employment_type=data['employment_type'],
            wage_amount=data['wage_amount'],
            work_days=data['work_days'],
            work_hours=data['work_hours'],
            work_period=data['work_period'],
            deadline_date=datetime.strptime(data['deadline'], '%Y-%m-%d') if data['deadline'] else None,
            status_name='pending_approval'
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({'success': True, 'job': new_job.to_dict()})

@app.route('/api/jobs/<int:job_id>/status', methods=['PUT'])
def update_job_status(job_id):
    data = request.json
    job = JobPosting.query.get_or_404(job_id)
    job.status_name = data['status']
    
    # 승인 시 gov_id 등을 기록할 수도 있음 (현재는 생략)
    
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/applications', methods=['GET', 'POST'])
def handle_applications():
    if request.method == 'GET':
        apps = Application.query.all()
        return jsonify([app.to_dict() for app in apps])

    if request.method == 'POST':
        data = request.json
        new_app = Application(
            job_id=data['job_id'],
            senior_id=data['senior_id'],
            application_date=datetime.utcnow(),
            status='submitted'
        )
        db.session.add(new_app)
        db.session.commit()
        return jsonify({'success': True, 'application': new_app.to_dict()})

@app.route('/api/applications/<int:app_id>/status', methods=['PUT'])
def update_application_status(app_id):
    data = request.json
    new_status = data['status']
    app_obj = Application.query.get_or_404(app_id)
    app_obj.status = new_status
    
    # 승인(채용) 시 이력 테이블(EmploymentHistory) 자동 생성
    if new_status == 'approved':
        history = EmploymentHistory(
            application_id=app_obj.application_id,
            start_date=datetime.utcnow(),
            status='active'
        )
        db.session.add(history)
    
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/histories', methods=['GET'])
def get_histories():
    histories = EmploymentHistory.query.all()
    return jsonify([h.to_dict() for h in histories])

@app.route('/api/seniors/<senior_id>', methods=['GET'])
def get_senior_profile(senior_id):
    print("[GET /api/seniors] senior_id =", senior_id)
    senior = Senior.query.get(senior_id)
    print("[GET /api/seniors] found =", bool(senior))
    if not senior:
        return jsonify({'success': False, 'message': '시니어를 찾을 수 없습니다.'}), 404

    return jsonify({
        'success': True,
        'profile': {
            'id': senior.senior_id,
            'name': senior.name,
            'phone': senior.phone,
            'birth_date': senior.birth_date.strftime('%Y-%m-%d') if senior.birth_date else '',
            'gender': senior.gender or '',
            'address': senior.address or '',
            'restricted_activities': senior.restricted_activities or '',
            'employment_type': senior.employment_type or '',
            'location': senior.location or '',
            'work_days': senior.work_days or '',
            'work_hours': senior.work_hours or '',
            'work_period': senior.work_period or ''
        }
    })
# 노인프로필 작성 및 수정
@app.route('/api/seniors/<senior_id>', methods=['PUT'])
def update_senior_profile(senior_id):
    senior = Senior.query.get_or_404(senior_id)
    data = request.json

    senior.birth_date = datetime.strptime(
        data['birth_date'], '%Y-%m-%d'
    ).date() if data.get('birth_date') else None

    senior.gender = data.get('gender')
    senior.address = data.get('address')
    senior.restricted_activities = data.get('restricted_activities')
    senior.employment_type = data.get('employment_type')
    senior.location = data.get('location')
    senior.work_days = data.get('work_days')
    senior.work_hours = data.get('work_hours')
    senior.work_period = data.get('work_period')

    db.session.commit()
    return jsonify({'success': True})

# 초기 데이터 주입 실행
if __name__ == '__main__':
    with app.app_context():
        # 기존 테이블을 모두 날리고 새로 생성 (스키마 변경 적용을 위해)
        # 주의: 실제 운영 서버에서는 절대 drop_all 사용 금지
        # db.drop_all() 
        db.create_all()
        
        try:
            from seed_data import init_db
            # 필요한 모델들을 인자로 전달
            init_db(db, Senior, Company, Government, JobPosting, Application, EmploymentHistory)
        except Exception as e:
            print(f"초기 데이터 생성 중 오류 발생: {e}")
            
    app.run(debug=True, port=5000)