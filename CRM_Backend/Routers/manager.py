from fastapi import FastAPI , Depends , HTTPException , status , APIRouter
from sqlalchemy.orm import Session , join , joinedload
from app.database import get_db
from app.auth import required_role , get_current_user
from app.schemas import  CustommerCategoryIn , LeadStageCreate , LeadStatusIn , ServiceCreate , CustomerCategoryUpdate
from app.models import User , CustomerCategory, LeadStage ,LeadStatus , Service , CustomerInstitution ,CustomerContacts
from app.models import Lead , Document , Activity , ActivityType
from typing import List , Optional

router = APIRouter(prefix='/manager')

#api for creating customer category
@router.post('/customer-category/create')
def create_customer_category(data : CustommerCategoryIn , db : Session = Depends(get_db) , current_user : User = Depends(required_role(['manager']))):

    exists = db.query(CustomerCategory.category_name).filter(CustomerCategory.category_name.in_(data.categories)).all()
    # eg : [("School",), ("Hospital",)]
    
    if exists :

        existing = [e[0] for e in exists]

    else :

        existing = []
    
    try:
        for catg in data.categories:

            if catg not in existing:

                db.add(CustomerCategory(category_name = catg))
        
        db.commit()

        return {"message" : "Category Added Successfully"}
    
    except:

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to add customer category")

#api for creating lead stage
@router.post('/lead-stage/create')
def create_lead_stage(data : LeadStageCreate , db:Session = Depends(get_db) , currrent_user : User = Depends(required_role(['manager']))):

    exists = db.query(LeadStage.name).filter(LeadStage.name.in_(data.leadstages)).all()

    if exists:

        existing_leads=[ld[0] for ld in exists]
        
    else :

        existing_leads = []

    try:
        for l in data.leadstages:

            if l not in existing_leads:

                db.add(LeadStage(name=l))
        db.commit()
        return {"message":"Leads Added Successfully"}
    
    except:

        db.rollback()
        raise HTTPException(status_code=400 , detail="failed to add new leads")

#api for getting lead stage
@router.get('/lead/stage')
def get_all_lead_stages(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user) ):

    stages = db.query(LeadStage).order_by(LeadStage.id).all()

    result = [

        {
            "id":stage.id,
            "name":stage.name
        }

        for stage in stages
    ]

    return result

#api for creating lead status
@router.post('/lead-status/create')
def create_lead_status(data:LeadStatusIn , db:Session = Depends(get_db) , current_user : User = Depends(required_role(['manager']))):

    try:

        for st in data.lead_statuses:

            stage = db.query(LeadStage).filter(LeadStage.id == st.stage_id).first()

            if not stage:

                raise HTTPException(status_code=400 , detail=f"Stage ID {st.stage_id} not found")

            duplicate = db.query(LeadStatus).filter(LeadStatus.name == st.name ,
                                                    LeadStatus.stage_id == st.stage_id).first()
            if not duplicate:

                db.add(LeadStatus(name = st.name ,stage_id = st.stage_id))

        db.commit()

        return {"message":"Statuses Added Successfully"}

    except Exception as e:

        db.rollback()

        raise HTTPException(status_code=400 , detail="Failed to add status")
    
#api for getting lead status
@router.get('/lead/status')
def get_lead_status(db:Session = Depends(get_db) , current_user : User = Depends(get_current_user)):

    lead_status = db.query(LeadStatus).options(joinedload(LeadStatus.stage)).order_by(LeadStatus.id).all()

    statuses = [
        {
            "id":ld.id,
            "name":ld.name,
            "stage":ld.stage.name,
            "stage_id":ld.stage_id
        }
        for ld in lead_status
    ]

    return statuses

#api for adding company services
@router.post('/services')
def create_company_services(data : ServiceCreate, db:Session = Depends(get_db) , current_user : User = Depends(required_role(['manager']))):

    existing_serv = db.query(Service.name).filter(Service.name.in_(data.services)).all()

    if existing_serv:

        existing = [ex[0] for ex in existing_serv]

    else :

        existing = []

    try :

        for sv in data.services:

            if sv not in existing:

                db.add(Service(name = sv))

        db.commit()

        return{"message":"Service Added Successfully"}
    
    except:

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to add new service")
    
#api to update a stage
@router.put("/lead-stage/{stage_id}")
def update_stage(stage_id: int, data: dict, db: Session = Depends(get_db),current_user: User = Depends(required_role(["manager"]))):

    stage = db.query(LeadStage).filter(LeadStage.id == stage_id).first()

    if not stage:

        raise HTTPException(status_code=404, detail="Stage not found")

    try:

        if "name" in data:

            stage.name = data["name"]

        db.commit()
        return {"message": "Stage updated successfully"}
    
    except Exception as e:

        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update stage: {str(e)}")


#api to update a status
@router.put("/lead-status/{status_id}")
def update_status(status_id: int, data: dict, db: Session = Depends(get_db),current_user: User = Depends(required_role(["manager"]))):

    status = db.query(LeadStatus).filter(LeadStatus.id == status_id).first()

    if not status:

        raise HTTPException(status_code=404, detail="Status not found")

    try:

        if "name" in data:
            status.name = data["name"]

        if "stage_id" in data:

            status.stage_id = data["stage_id"]

        db.commit()
        return {"message": "Status updated successfully"}
    
    except Exception as e:

        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update status: {str(e)}")
    
# update a service
@router.put("/services/{service_id}")
def update_service(service_id: int, data: dict, db: Session = Depends(get_db),  current_user: User = Depends(required_role(["manager"]))):
    
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    try:
        # update fields if present
        if "name" in data:
            service.name = data["name"]
        if "is_active" in data:
            service.is_active = data["is_active"]
        
        db.commit()
        return {"message": "Service updated successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update service: {str(e)}")
    

# Update customer category
@router.put('/customer-category/{id}')
def update_customer_category(id: int, data: CustomerCategoryUpdate, db: Session = Depends(get_db), current_user: User = Depends(required_role(['manager']))):
    
    category = db.query(CustomerCategory).filter(CustomerCategory.id == id).first()

    if not category:

        raise HTTPException(status_code=404, detail="Category not found")

    exists = db.query(CustomerCategory).filter(CustomerCategory.category_name == data.category_name, CustomerCategory.id != id).first()
    
    if exists:

        raise HTTPException(status_code=400, detail="Category name already exists")

    try:

        category.category_name = data.category_name
        db.commit()
        db.refresh(category)
        return {"message": "Category updated successfully"  }
    
    except:

        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update category")
    

@router.get('/all-leads')
def get_all_leads(db:Session = Depends(get_db) , current_user :User = Depends(required_role(['manager']))):

    leads = db.query(Lead).join(User , Lead.staff_id == User.id).filter(User.manager_id == current_user.id).options(
            joinedload(Lead.stage),
            joinedload(Lead.status),
            joinedload(Lead.service),
            joinedload(Lead.institution),
            joinedload(Lead.staff) 
            ).all()

    if not leads :

        if not leads:

            return {
                "all_leads": [],
                "ld_counts": {
                    "open_ld": 0,
                    "in_prog": 0,
                    "won_ld": 0,
                    "lost_ld": 0
                }
            }
    
    all_leads = [
        {
            "id":l.id ,
            "title": l.title,
            "company": l.institution.name,
            "stage": l.stage.name,
            "status":l.status.name ,
            "value": l.value,
            "closing" : l.expected_closing,
            "service" : l.service.name,
            "staff" : l.staff.name,
            "created_at" : l.created_at

        }
    for l in leads]

    open_lead = 0
    in_prog = 0
    won_lead = 0
    lost_lead = 0

    for ld in all_leads:

        if ld.get('status') == "Lost":

            lost_lead+=1

        elif ld.get('status') == "Won":

            won_lead+=1

        elif ld.get('status') == "New Lead":

            open_lead+=1

        elif ld.get("stage") != "Post-Sales" and (ld.get('status')!="Lost"):

            in_prog +=1

        elif ld.get('stage') == "Post-Sales" :

            won_lead+=1

    return {"all_leads" : all_leads, "ld_counts" :{
        "open_ld":open_lead,"in_prog" : in_prog,
        "won_ld" : won_lead , "lost_ld":lost_lead
    }}


@router.get("/{lead_id}/documents")
def get_manager_documents(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role("manager"))):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    docs = db.query(Document).filter(Document.lead_id == lead_id, Document.activity_id == None).options(joinedload(Document.uploader)).order_by(Document.uploaded_at.desc()).all()
    
    return [
        {
            "id": doc.id,
            "file_url": doc.file_path,
            "uploaded_by": doc.uploader.name,
            "uploaded_at": doc.uploaded_at
        }
        for doc in docs
    ]

#api for get comments
@router.get("/{lead_id}/comments")
def get_manager_comments( lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role("manager"))):

    ld = db.query(Lead).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead not found")

    comments = db.query(Activity).options(joinedload(Activity.documents)).filter(Activity.lead_id == lead_id,Activity.type == ActivityType.comment).order_by(Activity.created_at.asc()).all()
    
    result = []

    for act in comments:

        voice_file = (
            f"http://127.0.0.1:8000{act.documents[0].file_path}"
            if act.documents else None
        )

        result.append({
            "id": act.id,
            "type": "voice" if voice_file else "text",
            "text": act.description,
            "voice_url": voice_file,
            "created_at": act.created_at,
            "created_by": act.created_by
        })

    return result