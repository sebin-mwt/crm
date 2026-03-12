from fastapi import Depends , HTTPException ,status , APIRouter, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session , join , joinedload
from app.schemas import CustomerInstitutionIn , LeadIn , MemberCreate,CustomerUpdate , MemberUpdate , LeadStatusChange , ActivityIn
from app.database import get_db
from app.models import User , CustomerContacts , CustomerCategory , CustomerInstitution , Lead , LeadStage ,LeadStatus, StatusHistory
from app.models import Activity , Document , ActivityType
from app.auth import get_current_user, required_role
from datetime import datetime
import os
import uuid

app = APIRouter(prefix='/staff')

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

#api to create new Customer Instituition
@app.post('/customer/create')
def create_customer(data : CustomerInstitutionIn , db:Session = Depends(get_db) , current_user : User = Depends(required_role(['staff']))):

    try :

        new_insti = CustomerInstitution(name = data.name ,
                                        address = data.address,
                                        website = data.website ,
                                        category_id = data.category_id ,
                                        staff_assigned = current_user.id)
        
        db.add(new_insti)
        db.flush()

        for cont in data.contacts:

            new_cont = CustomerContacts(name = cont.name ,email = cont.email ,
                                        phone = cont.phone , position = cont.position,
                                        department = cont.department,
                                        customer_institution_id = new_insti.id) 
            
            db.add(new_cont)

        db.commit()
        db.refresh(new_cont)
        return {"message" : "Successfully Added"}

    except:

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to add new Customer")
    

#api to create a new lead
@app.post('/lead/create',status_code=201)
def create_new_lead(data : LeadIn , db: Session = Depends(get_db) , current_user : User = Depends(required_role(['staff']))):

    # close_date = datetime.strptime(f"{data.expected_closing} 23:59", "%Y-%m-%d %H:%M")

    close_date = datetime.combine(data.expected_closing, datetime.max.time())

    statuses = db.query(LeadStatus).filter(LeadStatus.id == data.status_id).first()

    if statuses.stage_id != data.stage_id:

        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE , detail="Lead Status Doesn't match with stage")

    try :
        
        new_lead = Lead( title = data.title,value = data.value,
                         expected_closing = close_date, stage_id = data.stage_id,
                         status_id = data.status_id , service_id = data.service_id,
                         staff_id = current_user.id, customer_institution_id = data.customer_id
                        )
        
        db.add(new_lead)
        db.flush()

        history = StatusHistory(lead_id = new_lead.id , new_status_id = new_lead.status_id,
                                changed_by = current_user.id)
        db.add(history)
        db.commit()

        db.refresh(new_lead)
        db.refresh(history)

        return{"message":"New Lead Created Successfully"}

    except:

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to create new lead")

#api for getting all leads
@app.get('/all-leads')
def get_all_leads(db:Session = Depends(get_db) , current_user :User = Depends(get_current_user)):

    leads = db.query(Lead).options(joinedload(Lead.stage),joinedload(Lead.status) , joinedload(Lead.institution),joinedload(Lead.service)).filter(Lead.staff_id == current_user.id).order_by(Lead.created_at.desc()).all()

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

#api to get details of a customer
@app.get('/{id}/customer')
def get_a_customer_detail(id : int ,db:Session = Depends(get_db), current_user : User = Depends(get_current_user)):

    customer = db.query(CustomerInstitution).filter(CustomerInstitution.id == id).options(joinedload(CustomerInstitution.members),joinedload(CustomerInstitution.category)).first()

    if not customer:

        raise HTTPException(status_code=404 , detail= f"User with {id} not found")

    customer_data = {
            "id":customer.id,
            "name": customer.name,
            "address":customer.address ,
            "website" :customer.website,
            "category" :customer.category.category_name,
            "category_id" :customer.category.id,
            "members" : [
                {
                    "id":m.id,
                    "name": m.name,
                    "email": m.email,
                    "position" : m.position,
                    "department":m.department,
                    "phone": m.phone
                } for m in customer.members
            ]
        }
    
    return customer_data

#update customer
@app.put("/{id}/customer")
def update_customer(id: int,data: CustomerUpdate,db: Session = Depends(get_db),current_user: User = Depends(required_role(["staff"]))):

    customer = db.query(CustomerInstitution).filter(CustomerInstitution.id == id).first()

    if not customer:

        raise HTTPException(status_code=404, detail="Customer not found")

    customer.name = data.name
    customer.address = data.address
    customer.website = data.website
    customer.category_id = data.category_id

    db.commit()
    db.refresh(customer)

    return {"message": "Customer updated successfully"}

#create member
@app.post("/{id}/member")
def create_member(id: int,data: MemberCreate,db: Session = Depends(get_db),current_user: User = Depends(required_role(["staff"]))):

    customer = db.query(CustomerInstitution).filter(CustomerInstitution.id == id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    new_member = CustomerContacts(
        name=data.name,
        email=data.email,
        phone=data.phone,
        position=data.position,
        department=data.department,
        customer_institution_id=id
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {"message": "Member added successfully"}

#api to update member details
@app.put("/{id}/member")
def update_member(id: int,data: MemberUpdate,db: Session = Depends(get_db),current_user: User = Depends(required_role(["staff"]))):

    member = db.query(CustomerContacts).filter(CustomerContacts.id == id).first()

    if not member:

        raise HTTPException(status_code=404, detail="Member not found")

    member.name = data.name
    member.email = data.email
    member.phone = data.phone
    member.position = data.position
    member.department = data.department

    db.commit()
    db.refresh(member)

    return {"message": "Member updated successfully"}

#api to delete a member
@app.delete("/{id}/member")
def delete_member(id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role(["staff"]))):

    member = db.query(CustomerContacts).filter(CustomerContacts.id == id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member)
    db.commit()

    return {"message": "Member deleted successfully"}

#api to get details of a particular lead
@app.get("/{id}/lead")
def get_lead_details( id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role(["staff", "manager", "management"])))    :   

    query = db.query(Lead).filter(Lead.id == id)

    if current_user.role == "staff":
        query = query.filter(Lead.staff_id == current_user.id)

    elif current_user.role == "manager":
        query = query.filter(Lead.manager_id == current_user.id)

    elif current_user.role == "management":

        pass

    lead = query.options(joinedload(Lead.stage),joinedload(Lead.status),joinedload(Lead.service),joinedload(Lead.institution),joinedload(Lead.staff)).first()

    if not lead:

        raise HTTPException(status_code=404, detail="Lead not found")

    all_data = { "id": lead.id,"title": lead.title,"value": lead.value,
                
                "expected_closing": lead.expected_closing, "created_at": lead.created_at,

                "stage": {
                    "id": lead.stage.id,
                    "name": lead.stage.name
                } ,

                "status": {
                    "id": lead.status.id,
                    "name": lead.status.name
                } if lead.status else None,

                "service": {
                    "id": lead.service.id,
                    "name": lead.service.name
                } if lead.service else None,

                "institution": {
                    "id": lead.institution.id,
                    "name": lead.institution.name
                } if lead.institution else None,
                "staff": lead.staff.name
            }
    return all_data


#api for status change of a lead 
@app.post('/{lead_id}/status-change')
def change_status(lead_id : int, data:LeadStatusChange ,db:Session = Depends(get_db), current_user : User = Depends(required_role(['staff']))):

    ld = db.query(Lead).filter(Lead.id == lead_id,Lead.staff_id == current_user.id).first()

    if not ld :

        raise HTTPException(status_code=404 , detail= "Lead not found")
    
    curr_sts = db.query(LeadStatus).filter(LeadStatus.id == ld.status_id).first()
    new_stats = db.query(LeadStatus).filter(LeadStatus.id == data.updated_status_id).first()

    try :

        if(new_stats.stage_id != ld.stage_id):

            ld.stage_id = new_stats.stage_id

        ld.status_id = new_stats.id

        status_history =  StatusHistory(lead_id = lead_id ,
                                        old_status_id = curr_sts.id,
                                        new_status_id = new_stats.id,
                                        changed_by = current_user.id)
        db.add(status_history)

        db.commit()

        return{"message":"Lead status changed successfully"}
    
    except Exception as e:

        db.rollback()
        raise HTTPException(status_code=400 , detail="Failed to change lead status")

#api to add a new activity 
@app.post('/{lead_id}/activity-add', status_code=201)
def add_new_activity(lead_id: int,data: ActivityIn,db: Session = Depends(get_db),current_user: User = Depends(required_role(['staff','manager']))):

    ld = db.query(Lead).options(joinedload(Lead.staff)).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Staff restriction
    if current_user.role == "staff" and ld.staff_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    # Manager restriction
    if current_user.role == "manager" and ld.staff.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Lead not under your team")

    try:

        new_activity = Activity(
            title=data.title if data.type != ActivityType.comment else None,
            type=data.type,
            description=data.description,
            lead_id=lead_id,
            activity_date=data.activity_date if data.type != ActivityType.comment else None,
            created_by=current_user.id
        )

        db.add(new_activity)
        db.commit()
        db.refresh(new_activity)

        return {"message": "Activity added"}

    except Exception as e:

        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to log activity, {str(e)}")


#api to get the activities of a lead
@app.get('/{lead_id}/activities')
def get_lead_activities(lead_id: int,db: Session = Depends(get_db), current_user: User = Depends(required_role(['staff','manager']))):

    activities = db.query(Activity).filter(Activity.lead_id == lead_id,Activity.type != ActivityType.comment).order_by(Activity.activity_date.desc()).all()

    return [
        {
            "id": act.id,
            "type": act.type.value,
            "title": act.title,
            "description": act.description,
            "date": act.activity_date,
            "created_at": act.created_at
        }
        for act in activities
    ]


#api to get the comments of a lead
@app.get('/{lead_id}/comments')
def get_all_comments(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    ld = db.query(Lead).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    comments = db.query(Activity).options(joinedload(Activity.documents),joinedload(Activity.user)).filter(Activity.lead_id == lead_id,Activity.type == ActivityType.comment).order_by(Activity.created_at.asc()).all()

    result = []

    for act in comments:

        voice_file = f"http://127.0.0.1:8000{act.documents[0].file_path}" if act.documents else None   

        result.append({
            "id": act.id,
            "type": "voice" if voice_file else "text",
            "text": act.description,
            "voice_url": voice_file,
            "created_at": act.created_at,
            "created_by":act.created_by,
            "created_by_name": act.user.name
        })

    return result


# api to get the status histories
@app.get('/{lead_id}/history')
def get_status_history(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    ld = db.query(Lead).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead not found")

    stats = db.query(StatusHistory).options(joinedload(StatusHistory.old_status),joinedload(StatusHistory.new_status),joinedload(StatusHistory.staff)).filter(StatusHistory.lead_id == lead_id)\
            .order_by(StatusHistory.changed_at.desc()).all()

    result = []

    for st in stats:
        result.append({
            "id": st.id,
            "old_status": st.old_status.name if st.old_status else None,
            "new_status": st.new_status.name if st.new_status else None,
            "changed_by": st.staff.name if st.staff else None,
            "changed_at": st.changed_at
        })

    return result

#api to add a document
@app.post("/{lead_id}/upload", status_code=201)
def add_document(lead_id: int, file: UploadFile = File(...), is_voice_comment: bool = Form(False),
                 db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    ld = db.query(Lead).filter(Lead.id == lead_id).first()

    if not ld:
        raise HTTPException(status_code=404, detail="Lead not found")

    try:

        # generate unique filename
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"

        # full server path
        file_path = os.path.join(UPLOAD_DIR, filename)

        # save the file
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        activity_id = None

        if is_voice_comment:

            new_activity = Activity(type=ActivityType.comment,
                                    description=None,
                                    lead_id=lead_id,
                                    created_by=current_user.id)

            db.add(new_activity)
            db.flush()

            activity_id = new_activity.id

        # store the public file URL
        file_url = f"/files/{filename}"

        new_doc = Document(file_path=file_url,
                           lead_id=lead_id,
                           activity_id=activity_id,
                           uploaded_by=current_user.id)

        db.add(new_doc)
        db.commit()

        return {"message": "Voice comment added" if is_voice_comment else "Document uploaded"}

    except Exception as e:

        db.rollback()
        raise HTTPException(status_code=400, detail=f"failed to add document: {str(e)}")
    
#api to get the documents
@app.get("/{lead_id}/documents")
def get_all_documents(lead_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    ld = db.query(Lead).filter(Lead.id == lead_id, Lead.staff_id == current_user.id).first()

    if not ld:
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


