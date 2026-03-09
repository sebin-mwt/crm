from fastapi import FastAPI , Depends , HTTPException ,status , APIRouter
from sqlalchemy.orm import Session , join , joinedload
from app.schemas import CustomerInstitutionIn , LeadIn , MemberCreate,CustomerUpdate , MemberUpdate
from app.database import get_db
from app.models import User , CustomerContacts , CustomerCategory , CustomerInstitution , Lead , LeadStage ,LeadStatus, StatusHistory
from app.models import Activity , Document
from app.auth import get_current_user, required_role
from datetime import datetime
app = APIRouter(prefix='/staff')


#api to create new Customer Instituition
@app.post('/customer/create')
def create_customer(data : CustomerInstitutionIn , db:Session = Depends(get_db) , current_user : User = Depends(required_role('staff'))):

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
def create_new_lead(data : LeadIn , db: Session = Depends(get_db) , current_user : User = Depends(required_role('staff'))):

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

    leads = db.query(Lead).options(joinedload(Lead.stage),joinedload(Lead.status) , joinedload(Lead.institution),joinedload(Lead.service)).filter(Lead.staff_id == current_user.id).order_by(Lead.id).all()

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
def update_customer(id: int,data: CustomerUpdate,db: Session = Depends(get_db),current_user: User = Depends(required_role("staff"))):

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
def create_member(id: int,data: MemberCreate,db: Session = Depends(get_db),current_user: User = Depends(required_role("staff"))):

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
def update_member(id: int,data: MemberUpdate,db: Session = Depends(get_db),current_user: User = Depends(required_role("staff"))):

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
def delete_member(id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role("staff"))):

    member = db.query(CustomerContacts).filter(CustomerContacts.id == id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member)
    db.commit()

    return {"message": "Member deleted successfully"}


#api to get details of a particular lead
from sqlalchemy.orm import joinedload

@app.get("/{id}/lead")
def get_lead_details(id: int,db: Session = Depends(get_db),current_user: User = Depends(required_role("staff"))):

    lead = db.query(Lead).filter(Lead.id == id, Lead.staff_id == current_user.id)\
        .options(joinedload(Lead.stage),joinedload(Lead.status),joinedload(Lead.service),joinedload(Lead.institution),
        ).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    all_data = { "id": lead.id,"title": lead.title,"value": lead.value,"expected_closing": lead.expected_closing,
                
                "created_at": lead.created_at,

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
            }
    return all_data
