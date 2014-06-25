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
#--------------------------------------------------------------------------------
#*********************************************************************************

from flask import Blueprint, request
import json
import hashlib, uuid # for passwords

from ..util import yellERROR, dumpJSON, respond500, respond200
from ..database import db
import app.s3 as s3


cleaner = Blueprint('cleaner', __name__)


"""
TEMP route setup
----

GET			/cleaner/lookup/phonenumber/<phonenumber>

GET 		/cleaner/auth 			-> return current-user
POST 		/cleaner/auth 			-> create user, login(user)
POST 		/cleaner/auth/login 	-> login(user)
POST,GET	/cleaner/auth/logout 	-> logout(user)


GET /cleaner/lookup/phonenumber/<phonenumber>
GET /cleaner/profile
PUT /cleaner/profile

Cleaner is the user model. Has
	phonenumber (unique)
		hashed_pwd
		salt

	name
	email (optional)
	pic_url (stored on S3)
	blurb
"""

# -- API stuff --------------------------------------------------------

@cleaner.route('/<id>/pic/upload', methods=['PUT', 'POST'])
def upload_pic(id='0'):
	try:
		file = request.files['file']
		print('-----upload_pic', id, file)

		pic_url = s3.upload_pic(id, file)

		return pic_url
	except Exception as e:
		return respond500(e)


@cleaner.route('/all')
def GET_all_cleaners():
	cleaners = db.cleaners.find()
	return dumpJSON([c for c in cleaners])


@cleaner.route('/lookup/id/<id>')
def GET_cleaner_by_id(id):
	cleaner = db.cleaners.find_one({"_id": id})
	return dumpJSON(cleaner)

@cleaner.route('/lookup/phonenumber/<phonenumber>')
def GET_cleaner_by_phonenumber(phonenumber):
	cleaner = db.cleaners.find_one({"phonenumber": phonenumber})
	return dumpJSON(cleaner)

# ------------------------------------------------------- API stuff -

@cleaner.route('/login', methods=['POST'])
def POST_login():
	try:
		data = json.loads(request.data)
		if not (data["phonenumber"] and data["password"]):
			raise Exception("phonenumber and password required to log in")

		cleaner = db.cleaners.find_one({"phonenumber": data["phonenumber"]})
		if not cleaner:
			raise Exception("No cleaner with phonenumber {0}".format(data["phonenumber"]))

		hashed_pwd = hash_password(data["password"], cleaner["salt"])
		if hashed_pwd != cleaner["hashed_pwd"]:
			raise Exception("Incorrect password")

		return dumpJSON(cleaner)
	except Exception as e:
		return respond500(e)


@cleaner.route('/new', methods=['POST'])
def POST_new():
	try:
		data = json.loads(request.data)
		ret = insert_new_cleaner(data)
		return dumpJSON(ret)
	except Exception as e:
		return respond500(e)






def hash_password(password, salt):
	return hashlib.sha512(password + salt).hexdigest()

def insert_new_cleaner(data):
	if not (data['phonenumber'] and data['password']):
		raise Exception('new cleaner data must include phonenumber and password')

	if db.cleaners.find_one({"phonenumber": data["phonenumber"]}):
		raise Exception("cleaner with phonenumber {0} already exists".format(data["phonenumber"]))

	salt = uuid.uuid4().hex
	hashed_pwd = hash_password(data["password"], salt)

	ret = db.cleaners.insert({
		"phonenumber": data['phonenumber'],
		"salt": salt,
		"hashed_pwd": hashed_pwd,
	})


	return ret













