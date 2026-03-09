from fastapi import FastAPI , Depends , HTTPException , status , APIRouter
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AssignManagerIn , ServiceCreate
from app.models import User , Service
from app.auth import required_role

app = APIRouter(prefix='/management')

#api for assigning manager for a user
@app.post('/assign-manger')
def assign_manager(data : AssignManagerIn , db:Session = Depends(get_db)):

    user = db.query(User).filter(User.id == data.user_id).first()

    manager = db.query(User).filter(User.id == data.manager_id).first()

    if not user or not manager:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail= "Users with id not found..")
    
    try :
        
        user.manager_id = manager.id  

        db.commit()

        db.refresh(user)

        return {"message": "Manager assigned successfully"}
    
    except Exception as e:

        db.rollback()

        raise HTTPException(status_code=400 , detail="Failed to assign manager")
    
#api for creating a new service 

@app.post('/create-service')
def create_service(data : ServiceCreate , db:Session = Depends(get_db) , current_user : User = Depends(required_role('management')) ):

    try  :

        new_service = Service(name = data.name , is_active = data.is_active)

        db.add(new_service)
        db.commit()
        db.refresh(new_service)

        return {"message":"Service added successfully"}
    
    except :

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to add new service..")
    
    