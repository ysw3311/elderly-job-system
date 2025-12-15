import json
from datetime import datetime

# 인자 목록 업데이트: Senior, Company, Government 등
def init_db(db, Senior, Company, Government, JobPosting, Application, EmploymentHistory):
    
    # 중복 실행 방지 (정부 계정으로 체크)
    if Government.query.filter_by(gov_id='gov_admin').first():
        print("데이터가 이미 존재합니다.")
        return

    print("ERD 기반 초기 데이터 생성 중...")

    # 1. 정부 (Government)
    gov = Government(
        gov_id='gov_admin',
        gov_password='gov123',
        name='정부 관리자',
        tel='02-1234-5678',
        department='노인복지과',
        email='admin@gov.kr'
    )

    # 2. 기업 (Company)
    samsung = Company(
        company_id='company_samsung',
        company_pw='comp123',
        name='삼성전자',
        business_number='123-45-67890',
        address='서울 강남구',
        phone='02-555-5555'
    )

    hyundai = Company(
        company_id='company_hyundai',
        company_pw='comp123',
        name='현대백화점',
        business_number='098-76-54321',
        address='서울 중구',
        phone='02-333-3333'
    )

    # 3. 시니어 (Senior)
    senior_kim = Senior(
        senior_id='senior_kim',
        password='senior123',
        name='김영희',
        phone='010-1234-5678',
        birth_date=datetime.strptime('1955-01-01', '%Y-%m-%d').date(),
        gender='female',
        address='서울 강남구',
        location='서울 강남구', # 희망 근무지
        employment_type='시간제' # 희망 고용형태
    )

    senior_park = Senior(
        senior_id='senior_park',
        password='senior123',
        name='박철수',
        phone='010-9876-5432',
        birth_date=datetime.strptime('1950-05-05', '%Y-%m-%d').date(),
        gender='male',
        address='서울 중구',
        location='서울 중구',
        employment_type='일용직'
    )

    db.session.add_all([gov, samsung, hyundai, senior_kim, senior_park])
    db.session.commit()

    # 4. 공고 (JobPosting)
    job1 = JobPosting(
        company_id=samsung.company_id,
        job_title='시설 관리 보조',
        job_description='사무실 환경 관리 및 간단한 시설 점검 업무',
        location='서울 강남구',
        employment_type='시간제',
        wage_amount=12000,
        work_days='월, 수, 금',
        work_hours='09:00-13:00',
        work_period='6개월',
        status_name='approved',
        deadline_date=datetime.strptime('2025-12-15', '%Y-%m-%d').date(),
        gov_id=gov.gov_id # 승인한 공무원 ID
    )

    job2 = JobPosting(
        company_id=hyundai.company_id,
        job_title='고객 안내 도우미',
        job_description='매장 내 고객 안내 및 간단한 상담 업무',
        location='서울 중구',
        employment_type='시간제',
        wage_amount=13000,
        work_days='화, 목',
        work_hours='10:00-15:00',
        work_period='3개월',
        status_name='pending_approval',
        deadline_date=datetime.strptime('2025-12-20', '%Y-%m-%d').date()
    )

    db.session.add_all([job1, job2])
    db.session.commit()

    # 5. 지원 (Application)
    app1 = Application(
        job_id=job1.job_id,
        senior_id=senior_kim.senior_id,
        status='approved',
        application_date=datetime.strptime('2025-11-18', '%Y-%m-%d'),
        notes='경력과 근무조건이 적합함'
    )

    db.session.add(app1)
    db.session.commit()

    # 6. 이력 (EmploymentHistory)
    # 채용 승인된 건에 대해 이력 생성
    history1 = EmploymentHistory(
        application_id=app1.application_id,
        start_date=datetime.strptime('2025-11-20', '%Y-%m-%d').date(),
        status='active',
        verified_at=datetime.utcnow()
    )

    db.session.add(history1)
    db.session.commit()

    print("초기 데이터 생성 완료!")