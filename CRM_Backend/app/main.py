from fastapi import FastAPI , Depends ,status , HTTPException 
from sqlalchemy.orm import Session , joinedload
from fastapi.staticfiles import StaticFiles
from app.database import get_db , engine
from fastapi.middleware.cors import CORSMiddleware
from app import models 
from app.auth import hash_password , authenticate_password  , create_access_token , get_current_user
from app.models import User , Service , CustomerCategory , CustomerInstitution , CustomerContacts , UserRoles
from app.schemas import RegisterUser , LoginUser
from Routers import management , manager , staff

models.Base.metadata.create_all(bind = engine)

app = FastAPI()

app.include_router(management.app)
app.include_router(manager.router)
app.include_router(staff.app)

app.mount("/files", StaticFiles(directory="uploads/documents"), name="files")

origin = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
]

app.add_middleware( 
    CORSMiddleware ,
    allow_origins = origin,
    allow_credentials = True,   
    allow_methods = ["*"],
    allow_headers = ["*"]
)


#api for register
@app.post('/register' ,status_code=201)
def register(data : RegisterUser , db:Session = Depends(get_db)):

    exists = db.query(User).filter(User.email == data.email).first()

    if exists :

        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail= "User email already exists")
    
    hashed_password = hash_password(data.password)

    try :

        new_user = User(name = data.name,
                        email = data.email,
                        password = hashed_password,
                        role = data.role)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message":"User Created Successfully"}

    except :

        db.rollback()

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail="Failed to create new user")
    
#api for login
@app.post('/login')
def login_user(data : LoginUser , db:Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user :

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found..")
    
    password_verified = authenticate_password(data.password , user.password)

    if not password_verified :

        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="Incorrect password or username..")
    
    access_token = create_access_token(data={"sub":user.email , "role":user.role.value})

    data= {"access_token":access_token ,
        "user_data":{
            "user_id":user.id,
            "email":user.email,
            "role":user.role    
        } }

    return data 

#api for geting all users
@app.get('/users')
def get_users( db: Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    staff_users = db.query(User).filter(User.role == UserRoles.staff).all()

    if staff_users :
        
        user_data = [{
            "id": u.id ,
            "name": u.name,
            "email":u.email ,
            "role" : u.role,
            "manager_id": u.manager_id,
            "is_assigned" :True if u.manager_id else False

        } for u in staff_users]

    managers = db.query(User).filter(User.role == UserRoles.manager).all()

    if managers:
         
         manager_data = [{
            "id": u.id ,
            "name": u.name,
            "email":u.email ,
            "role" : u.role

        } for u in managers]

    return {"staffs":user_data , "managers":manager_data} 

# api for listing the services
@app.get('/services')
def get_all_services(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    all_services = db.query(Service).order_by(Service.id).all()

    data =[
        {
            "id":sv.id,
            "name":sv.name,
            "is_active": sv.is_active 
        } 
        
    for sv in all_services ]

    return data


# api for listing the active services
@app.get('/active-services')
def get_all_services(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    all_services = db.query(Service).filter(Service.is_active==True).order_by(Service.id).all()

    data =[
        {
            "id":sv.id,
            "name":sv.name,
            "is_active": sv.is_active 
        } 
        
    for sv in all_services ]

    return data

#api for getting all customer categories
@app.get('/customer/category')
def get_all_customer_category(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    all_categories = db.query(CustomerCategory).order_by(CustomerCategory.id).all()

    return all_categories

#api to get customer institutions
@app.get('/customers')
def get_all_customer_institution(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    customers = db.query(CustomerInstitution).order_by(CustomerInstitution.id).all()

    return customers


#api to get customer institutions
@app.get('/customers/created')
def get_all_customer_institution(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    customers = db.query(CustomerInstitution).filter(CustomerInstitution.staff_assigned == current_user.id).order_by(CustomerInstitution.id).all()

    return customers    

