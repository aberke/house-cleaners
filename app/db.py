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
#
#	database configuration file
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************


from pymongo import MongoClient

import config
from .util import yellError


# db is None until __init__ gets it
db = None

def get_db():
	if not db:
		connect()
	return db

def connect():
	try:
		client = MongoClient(config.MONGODB_HOST)
		db = client[config.MONGODB_DB]
		print('connected to database {0} on {1}'.format(config.MONGODB_DB, config.MONGODB_HOST))
	except Exception as e:
		msg = 'Error connecting to database: {0}'.format(str(e))
		yellError(msg)
		raise Exception(msg)







