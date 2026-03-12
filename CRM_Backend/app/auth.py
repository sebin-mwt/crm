from passlib.context import CryptContext
from datetime import datetime , timedelta , timezone
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException , status , Depends
from sqlalchemy.orm import Session
from jose import jwt , JWTError
from app.models import User
from app.database import get_db


SECRET_KEY = "bciwSGUf02j0f32ejon001j0nqcvH839"
ALGORITHM = "HS256"
EXPIRY_MINUTES = 40

pwd_context = CryptContext(schemes=['bcrypt'], deprecated = "auto")
token_dependency = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password : str):

    return pwd_context.hash(password)

def authenticate_password(raw_password :str, hashed_pwd:str):

    return pwd_context.verify(raw_password , hashed_pwd)

def create_access_token(data : dict ):

    to_encode = data.copy()

    expiry = datetime.now(timezone.utc) + timedelta(minutes=EXPIRY_MINUTES)

    to_encode.update({"exp":expiry})

    return jwt.encode(to_encode , SECRET_KEY , algorithm = ALGORITHM )

def get_current_user(token : str = Depends(token_dependency) , db : Session = Depends(get_db)):

    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",headers={"WWW-Authenticate": "Bearer"})

    
    try :

        payload = jwt.decode(token , SECRET_KEY ,algorithms=[ALGORITHM] )

        email = payload.get('sub')

        role = payload.get('role')

        if email is None:
             
            raise credential_exception
        
    except JWTError:

        raise credential_exception
    
    user = db.query(User).filter(User.email == email).first()

    if not user:

        raise credential_exception
    
    return user

def required_role(roles: list):

    def role_checker(current_user: User = Depends(get_current_user)):

        if current_user.role.value not in roles:

            raise HTTPException(status_code=403, detail="Not authorized")
        
        return current_user
        
    return role_checker    