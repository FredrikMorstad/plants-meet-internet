import os
from .config import env_config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

env_variable = os.getenv('API_VERSION')
if env_variable == None:
    env_variable = 'local'

config = env_config[env_variable]

# prod and dev db mounted in dockerfile
if env_variable == 'local':
    if not os.path.exists(config.DB_FOLDER):
        os.mkdir(config.DB_FOLDER)
    if not os.path.exists(config.DB_URI):
        open(config.DB_URI, 'w')
    
engine = create_engine(f'sqlite:///{config.DB_URI}', connect_args={'check_same_thread': False})
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_title():
    api_name = 'PLANT-API'
    return f'{api_name}-{config.ENV}' if config.ENV != 'prod' else api_name

def get_db():
    db = session_local()
    try :
        yield db
    finally:
        db.close()

def init_test_db():
    test_engine = create_engine(f'sqlite:///:memory:', connect_args={'check_same_thread': False})
    session_local = session_local = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = session_local()
    Base.metadata.create_all(test_engine)
    return session
