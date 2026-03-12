from fastapi import FastAPI , Depends , HTTPException , status , APIRouter
from sqlalchemy.orm import Session , join , joinedload
from app.database import get_db
from app.schemas import AssignManagerIn , ServiceCreate
from app.models import User , Service ,Lead , UserRoles , Document , StatusHistory
from app.auth import required_role , get_current_user

app = APIRouter(prefix='/management' ,tags=['/management'])

@app.get("/notifications")
def get_notifications(db: Session = Depends(get_db),current_user: User = Depends(required_role(["management"]))):

    counts = db.query(User).filter(User.role == UserRoles.staff,User.manager_id == None).count()

    return {"unassigned_staff_count": counts}


#api for updating assigned  
@app.put("/update-manager")
def update_manager( data: AssignManagerIn, db: Session = Depends(get_db),current_user: User = Depends(required_role(["management"]))):

    staff = db.query(User).filter(User.id == data.staff_id).first()

    manager = db.query(User).filter(User.id == data.manager_id).first()

    if not staff or not manager:

        raise HTTPException( status_code=status.HTTP_404_NOT_FOUND, detail="Staff or Manager not found")

    if staff.role.value != "staff":

        raise HTTPException(status_code=400,detail="Selected user is not staff")

    if manager.role.value != "manager":

        raise HTTPException( status_code=400, detail="Selected user is not a manager")
    try:

        staff.manager_id = manager.id

        db.commit()

        db.refresh(staff)

        return {"message": "Manager updated successfully"}

    except Exception:

        db.rollback()

        raise HTTPException(status_code=400,  detail="Failed to update manager")

#api to get all leads
@app.get('/all-leads')
def get_all_leads(db:Session = Depends(get_db) , current_user :User = Depends(required_role(['management']))):

    leads = db.query(Lead).options(joinedload(Lead.stage),joinedload(Lead.status) , joinedload(Lead.institution),joinedload(Lead.service)).order_by(Lead.created_at.desc()).all()

    if not leads :

        return leads
    
    all_leads = [
        {
            "id":l.id ,
            "title": l.title,
            "company": l.institution.name,
            "stage": l.stage.name,
            "status":l.status.name ,
            "value": l.value,
            "closing" : l.expected_closing,
            "service" : l.service.name
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

#get all users 
@app.get('/all-staff')
def get_all_staff(db:Session = Depends(get_db) , current_user:User = Depends(required_role(['management']))) :

    users = db.query(User).all()

    user_data = []

    for u in users :

        user_data.append({
            "id" : u.id ,
            "name" : u.name ,
            "role" : u.role.value ,
            "total_leads" : len(u.leads) ,
            "is_active" : u.is_active
        })

    return {"employees":user_data}

#get lead data for managemnet
# @app.get("/{id}/lead")
# def get_lead_management(id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role(["management"]))):

#     lead = (
#         db.query(Lead)
#         .options(
#             joinedload(Lead.stage),
#             joinedload(Lead.status),
#             joinedload(Lead.service),
#             joinedload(Lead.institution),
#             joinedload(Lead.staff)
#         )
#         .filter(Lead.id == id)
#         .first()
#     )

#     if not lead:
#         raise HTTPException(status_code=404, detail="Lead not found")

#     all_data = {

#         "id": lead.id,
#         "title": lead.title,
#         "value": lead.value,
#         "expected_closing": lead.expected_closing,
#         "created_at": lead.created_at,

#         "stage": {
#             "id": lead.stage.id,
#             "name": lead.stage.name
#         } if lead.stage else None,

#         "status": {
#             "id": lead.status.id,
#             "name": lead.status.name
#         } if lead.status else None,

#         "service": {
#             "id": lead.service.id,
#             "name": lead.service.name
#         } if lead.service else None,

#         "institution": {
#             "id": lead.institution.id,
#             "name": lead.institution.name
#         } if lead.institution else None,

#         "staff": {
#             "id": lead.staff.id,
#             "name": lead.staff.name
#         } if lead.staff else None
#     }

#     return all_data


#api for getting docs of a lead 
@app.get("/{lead_id}/documents")
def get_documents_management(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role(["management"]))):

    ld = db.query(Lead).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead with id not found")

    docs = (
        db.query(Document)
        .filter(Document.lead_id == lead_id, Document.activity_id == None)
        .options(joinedload(Document.uploader))
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return [
        {
            "id": doc.id,
            "file_url": doc.file_path,
            "uploaded_by": doc.uploader.name,
            "uploaded_at": doc.uploaded_at
        }
        for doc in docs
    ]


@app.get("/{lead_id}/history")
def get_lead_history_management(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role(["management"]))):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    history = db.query(StatusHistory).filter(StatusHistory.lead_id == lead_id).order_by(StatusHistory.changed_at.desc()).all()

    return [
        {
            "id": h.id,
            "old_status": h.old_status.name if h.old_status else None,
            "new_status": h.new_status.name if h.new_status else None,
            "changed_at": h.changed_at
        }
        for h in history
    ]
# 	- chart team performance 
