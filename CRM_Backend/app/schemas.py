from pydantic import BaseModel , EmailStr 
from app.models import UserRoles
from typing import Optional , List 
from datetime import datetime

class RegisterUser(BaseModel):

    name : str

    email : EmailStr

    password : str

    role : UserRoles

class LoginUser(BaseModel):

    email : EmailStr

    password : str

class AssignManagerIn(BaseModel):

    user_id : int 

    manager_id : int

class ServiceCreate(BaseModel):

    services : List[str]

class CustommerCategoryIn(BaseModel):

    categories : List[str]

class LeadStageCreate(BaseModel):

    leadstages : List[str]

class LeadStatus(BaseModel):

    name : str

    stage_id : int

class LeadStatusIn(BaseModel):

    lead_statuses : List[LeadStatus]

class CustomerCategoryUpdate(BaseModel):

    category_name: str

class CustomerContactIn(BaseModel):

    name : str

    email : EmailStr

    phone : str

    position : str

    department : str

class CustomerInstitutionIn(BaseModel):

    name : str

    address : str 

    website : Optional[str]

    category_id : int

    contacts : List[CustomerContactIn]

class LeadIn(BaseModel):

    title : str

    value : int

    expected_closing : datetime

    stage_id : int

    status_id : int

    service_id : int

    customer_id : int


class CustomerUpdate(BaseModel):

    name: str

    address: str

    website: str

    category_id: int


class MemberCreate(BaseModel):

    name: str

    email: str

    phone: str

    position: str

    department: str

class MemberUpdate(BaseModel):

    name: str

    email: str

    phone: str

    position: str

    department: str
    
    