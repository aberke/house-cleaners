#********************************************************************************
#--------------------------------------------------------------------------------
#
#	Significance Labs
#	Brooklyn, NYC
#
# 	Author: Alexandra Berke (aberke)
# 	Written: June 2014
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************





import os

# test.py sets environment to TESTING, heroku has environment as PRODUCTION
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'DEVELOPMENT')

HOST = os.getenv('HOST', '127.0.0.1')
PORT = os.getenv('PORT', 3000)
DEBUG= False if ENVIRONMENT == 'PRODUCTION' else True


# - MONGO ----------------------------------
# if development: host is "mongodb://localhost:27017"
# if production: db is set in host URI, host is in "MONGOHQ_URL" env variable found in '$ heroku config' command
# if TESTING: db is 'testing'

MONGODB_HOST 	= "mongodb://localhost:27017"
MONGODB_DB 		= "house-cleaners"

if ENVIRONMENT == 'PRODUCTION':
	MONGODB_HOST=os.environ.get("MONGOHQ_URL", None)

elif ENVIRONMENT == 'TESTING':
	MONGODB_DB 	= "house-cleaners-testing"

# ---------------------------------- MONGO -



SECRET_KEY 				= os.getenv('SESSION_SECRET', 'Significance')
# AWS_ACCESS_KEY_ID		= os.environ['AWS_ACCESS_KEY_ID']
# AWS_SECRET_ACCESS_KEY	= os.environ['AWS_SECRET_ACCESS_KEY']

print('config--------------------')
print('ENVIRONMENT', ENVIRONMENT)
print('MONGODB_DB', MONGODB_DB)
print('MONGODB_HOST', MONGODB_HOST)
print('config--------------------')

del os