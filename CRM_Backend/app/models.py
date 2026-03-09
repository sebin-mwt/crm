from app.database import Base
from sqlalchemy import Column , String , Integer ,ForeignKey, DateTime , Enum , func , Boolean , Date
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum


class UserRoles(PyEnum):

    staff = "staff"
    manager = "manager"
    management = "management"

class ActivityType(PyEnum):

    call = "call"
    comment = "comment"
    meeting = "meeting"


class User(Base):

    __tablename__ = "users"

    id = Column(Integer , primary_key=True , autoincrement=True)

    name = Column(String , nullable=False)

    email = Column(String, nullable=False , unique=True)

    password = Column(String , nullable=False)

    role = Column(Enum(UserRoles)  , default=UserRoles.staff)

    manager_id = Column(Integer , ForeignKey("users.id") , nullable=True)

    is_active = Column(Boolean , default=True)

    created_at = Column(DateTime(timezone=True) , server_default= func.now())

    #realations

    customers = relationship("CustomerInstitution" , back_populates="staff")

    leads = relationship("Lead" , back_populates="staff")

    activities = relationship("Activity" , back_populates= "user")

    histories = relationship("StatusHistory" , back_populates="staff")

    documents = relationship("Document" , back_populates="uploader")


class Service(Base):

    __tablename__ = "services"

    id = Column(Integer, primary_key=True , autoincrement=True)

    name = Column(String , nullable=False , unique=True)

    is_active = Column(Boolean , default=True)

    # relationship
    
    leads = relationship("Lead" , back_populates="service")

class CustomerCategory(Base):

    __tablename__ = "customer_categories"

    id = Column(Integer, primary_key=True , autoincrement=True)

    category_name = Column(String , nullable=False)

    # relationship

    customer = relationship("CustomerInstitution" , back_populates="category")


class CustomerInstitution(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True , autoincrement=True)

    name = Column(String)

    address = Column(String)

    website = Column(String)
    
    category_id = Column(Integer,ForeignKey("customer_categories.id"))

    staff_assigned = Column(Integer , ForeignKey("users.id"))

    created_at = Column(DateTime(timezone=True) , server_default= func.now())

    # relationship
    
    category = relationship("CustomerCategory" , back_populates="customer")

    staff = relationship("User", back_populates="customers" )

    members = relationship("CustomerContacts" , back_populates="institution" )

    lead = relationship("Lead", back_populates="institution" , cascade="all, delete-orphan")


class CustomerContacts(Base):

    __tablename__ = "customer_contacts"

    id = Column(Integer , primary_key=True , autoincrement=True)

    name = Column(String )

    email = Column(String)

    phone = Column(String)

    position = Column(String)

    department = Column(String)

    customer_institution_id = Column(Integer , ForeignKey("customers.id"))

    created_at = Column(DateTime(timezone=True) , server_default=func.now())

    # relationship

    institution = relationship("CustomerInstitution" , back_populates="members")

class LeadStage(Base):

    __tablename__ = "lead_stages"

    id = Column(Integer , primary_key=True , autoincrement=True)

    name = Column(String)

    # relationship

    leads = relationship("Lead" , back_populates="stage")

    statuses = relationship("LeadStatus" , back_populates="stage")

class LeadStatus(Base):

    __tablename__ = "lead_statuses"

    id = Column(Integer , primary_key=True , autoincrement=True)

    name = Column(String)

    stage_id = Column(Integer , ForeignKey("lead_stages.id"))

    # relationship

    leads = relationship("Lead" , back_populates="status")

    stage = relationship("LeadStage" , back_populates="statuses")

    old_history = relationship("StatusHistory",back_populates="old_status",foreign_keys="[StatusHistory.old_status_id]")

    new_history = relationship("StatusHistory",back_populates="new_status",foreign_keys="[StatusHistory.new_status_id]")


class Lead(Base):

    __tablename__ = "leads"

    id = Column(Integer , primary_key=True , autoincrement=True)

    title = Column(String , nullable=False)

    value = Column(Integer)

    expected_closing = Column(DateTime)

    stage_id = Column(Integer , ForeignKey("lead_stages.id"))

    status_id = Column(Integer ,ForeignKey("lead_statuses.id"))

    service_id = Column(Integer , ForeignKey("services.id"))

    staff_id = Column(Integer , ForeignKey("users.id"))

    customer_institution_id = Column(Integer , ForeignKey("customers.id"))

    created_at = Column(DateTime(timezone=True) , server_default= func.now())

    # relationship

    stage = relationship("LeadStage" , back_populates="leads")

    status = relationship("LeadStatus", back_populates="leads")

    service = relationship("Service", back_populates="leads")

    staff  = relationship("User" , back_populates="leads")

    institution = relationship("CustomerInstitution" , back_populates="lead")

    activity = relationship("Activity" , back_populates="lead")

    history = relationship("StatusHistory" , back_populates="lead" )

    documents = relationship("Document" , back_populates="lead" )


class Activity(Base):

    __tablename__ = "activities"

    id = Column(Integer , primary_key=True , autoincrement=True)

    type = Column(Enum(ActivityType))

    title = Column(String)

    description = Column(String)

    activity_date = Column(Date)

    lead_id = Column(Integer , ForeignKey("leads.id"))

    created_by = Column(Integer , ForeignKey("users.id"))

    created_at = Column(DateTime(timezone=True) , server_default= func.now())
    
    # relationship
    
    lead = relationship("Lead" , back_populates="activity")

    user = relationship("User" , back_populates="activities")

    documents = relationship("Document", back_populates="activity")


class StatusHistory(Base):

    __tablename__ = "status_histories"

    id = Column(Integer , autoincrement=True , primary_key=True)

    lead_id = Column(Integer , ForeignKey("leads.id"))

    old_status_id = Column(Integer , ForeignKey("lead_statuses.id"))

    new_status_id = Column(Integer , ForeignKey("lead_statuses.id"))

    changed_by = Column(Integer , ForeignKey("users.id"))

    changed_at = Column(DateTime(timezone=True) , server_default=func.now())

    # relationship

    lead = relationship("Lead",back_populates="history" )

    old_status = relationship("LeadStatus", foreign_keys=[old_status_id] , back_populates="old_history")

    new_status = relationship("LeadStatus", foreign_keys=[new_status_id], back_populates="new_history")

    staff = relationship("User" , back_populates="histories")


class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True , autoincrement=True)

    file_path = Column(String , nullable=False)

    lead_id = Column(Integer , ForeignKey('leads.id'),nullable=False)

    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationship
    
    lead = relationship("Lead" ,back_populates="documents" )

    uploader = relationship("User" , back_populates="documents")

    activity = relationship("Activity", back_populates="documents")