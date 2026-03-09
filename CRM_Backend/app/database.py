from sqlalchemy.orm import sessionmaker , declarative_base
from sqlalchemy import create_engine 

DATABASE_URL = "postgresql://postgres:Password%40123@localhost:5432/crm"

engine = create_engine(DATABASE_URL)

Sessionlocal = sessionmaker(autoflush=False, autocommit=False , bind=engine)

Base = declarative_base()

def get_db():

    db = Sessionlocal()

    try :

        yield db

    finally:

        db.close()
