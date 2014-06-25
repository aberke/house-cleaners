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
from .util import yellERROR

def get_db():
	if not db:
		db = connect()
		print('connected to database {0} on {1}'.format(config.MONGODB_DB, config.MONGODB_HOST))
	return db

def connect():
	try:
		client = MongoClient(config.MONGODB_HOST)
		return client[config.MONGODB_DB]
	except Exception as e:
		msg = 'Error connecting to database: {0}'.format(str(e))
		yellERROR(msg)
		raise Exception(msg)

db = connect()





