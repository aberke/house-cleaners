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

from flask import Blueprint, request, session
import json
import hashlib, uuid # for passwords
from bson import ObjectId

from ..util import yellERROR, dumpJSON, respond500, respond200
from ..database import db
import app.twilio_tools as twilio_tools
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
		reset_code (temp code texted to user to reset password)
		reset_code_expires (datetime at which reset_code no longer valid)

	name
	email (optional)
	pic_url (stored on S3)
	blurb

	(text-fields until we decide how to do this better)
	rates_text
	services_text
	locations_text
	conditions_text

"""

# -- API stuff --------------------------------------------------------

def update_cleaner_profile(id, data):
	# TODO - RAISE ERROR IF ret == 0?
	ret = db.cleaners.update({ "_id": ObjectId(id) }, { "$set": data})
	return ret

@cleaner.route('/<id>/pic/upload', methods=['PUT', 'POST'])
def upload_pic(id='0'):
	try:
		file = request.files['file']

		pic_url = s3.upload_pic(id, file)
		update_cleaner_profile(id, {"pic_url": pic_url})
		return pic_url
	except Exception as e:
		return respond500(e)


@cleaner.route('/all')
def GET_all_cleaners():
	try:
		cleaners = db.cleaners.find()
		return dumpJSON([c for c in cleaners])
	except Exception as e:
		return respond500(e)


@cleaner.route('/lookup/id/<id>')
def GET_cleaner_by_id(id):
	cleaner = get_cleaner(id=id)
	return dumpJSON(cleaner)

@cleaner.route('/lookup/phonenumber/<phonenumber>')
def GET_cleaner_by_phonenumber(phonenumber):
	cleaner = get_cleaner(phonenumber=phonenumber)
	return dumpJSON(cleaner)

@cleaner.route('/validate-new-phonenumber/<phonenumber>')
def GET_validate_new_phonenumber(phonenumber):
	cleaner = db.cleaners.find_one({"phonenumber": phonenumber})
	if cleaner:
		return respond500(str("User with phone number " + phonenumber + " already exists"))
	try:
		twilio_tools.send_SMS(phonenumber, "Welcome to Clean Slate!")
		return respond200()
	except Exception as e:
		return respond500(e)

# ------------------------------------------------------- API stuff -



# TODO - ORGANIZE
@cleaner.route('/booking', methods=['POST'])
def POSTbooking():
	try:
		data = json.loads(request.data)
		cleaner = data['cleaner']
		booking = data['booking']
		cleaner = get_cleaner(id=cleaner['_id'])
		
		# send sms to cleaner
		twilio_tools.send_SMS(cleaner['phonenumber'], str("You have a new CleanSlate appointment.\nTime: July 10, 12pm\nDuration: 3 hours\nClient Name: Aoife Byrne \nAddress: 43 Midwood Street, NT 11225."))
		
		# send sms to client
		twilio_tools.send_SMS(booking['phonenumber'], str("You have a confirmed CleanSlate appointment with Jason.\nTime: July 10, 12pm\nDuration: 3 hours\nCost: $70"))
		return respond200()
	except Exception as e:
		return respond500(e)

# - Auth stuff -------------------------------------------------------

import string
import random
def id_generator(size=4, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

from datetime import datetime, timedelta
RESET_CODE_EXPIRATION = timedelta(hours=1)

@cleaner.route('/send-reset-code', methods=['POST'])
def send_reset_code():
	"""
	Send reset_code via SMS to the user 
		Each reset_code expires after RESET_CODE_EXPIRATION
		If not yet set, or if expired, reset reset_code and reset_code_expires
	"""
	try:
		data = json.loads(request.data)
		if not 'phonenumber' in data:
			raise Exception("No phonenumber provided")
		phonenumber = data['phonenumber']
		cleaner = get_cleaner(phonenumber=phonenumber)
		if not cleaner:
			raise Exception(str("No user with phonenumber " + phonenumber))

		if ('reset_code' in cleaner and 'reset_code_expires' in cleaner and (datetime.now() < cleaner['reset_code_expires'])):
			reset_code = cleaner["reset_code"]
		else:
			reset_code = id_generator(size=4)
			reset_code_expires = datetime.now() + RESET_CODE_EXPIRATION
			update_cleaner_profile(cleaner["_id"], {"reset_code": reset_code, "reset_code_expires": reset_code_expires})

		twilio_tools.send_SMS(phonenumber, str("Your password reset code is: " + reset_code))
		return respond200()
	except Exception as e:
		return respond500(e)

@cleaner.route('/reset-password', methods=['PUT'])
def POST_reset_password():
	try:
		data = json.loads(request.data)
		cleaner = get_cleaner(phonenumber=data["phonenumber"])
		if not (cleaner and 'reset_code' in cleaner):
			raise Exception(str("Something went wrong"))

		if not ((data['reset_code'] == cleaner["reset_code"]) and (datetime.now() < cleaner['reset_code_expires'])):
			raise Exception(str("Invalid password reset code"))

		# if they made it this far all is good
		new_hashed_pwd = hash_password(data["password"], cleaner["salt"])
		update_cleaner_profile(cleaner["_id"], {"hashed_pwd": new_hashed_pwd})

		cleaner_data = public_cleaner(cleaner)
		login(cleaner_data)
		return respond200()
	except Exception as e:
		return respond500(e)



@cleaner.route('/user', methods=['GET'])
def GET_user():
	return dumpJSON(session['user'] if 'user' in session else None)


@cleaner.route('/logout')
def logout():
	session['user'] = None
	return respond200()

@cleaner.route('/login', methods=['POST'])
def POST_login(data=None):
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

		cleaner_data = public_cleaner(cleaner)
		login(cleaner_data)
		return dumpJSON(cleaner_data)
	except Exception as e:
		return respond500(e)


@cleaner.route('/profile/<id>', methods=['PUT'])
def PUT_profile(id):
	try:
		data = json.loads(request.data)
		# filter in only the data that is allowed for update
		filtered_keys = ["name", "blurb", "rates_text", "conditions_text", "services_text", "locations_text"]
		ret = update_cleaner_profile(id, {k: data[k] for k in filtered_keys if k in data})
		return respond200()
	except Exception as e:
		return respond500(e)


@cleaner.route('/profile', methods=['POST'])
def POST_profile():
	""" Insert new cleaner profile and login new cleaner """
	try:
		data = json.loads(request.data)
		id = insert_new_cleaner(data)
		cleaner = get_cleaner(id=id)
		cleaner = public_cleaner(cleaner)
		login(cleaner)
		return dumpJSON(cleaner)
	except Exception as e:
		return respond500(e)




def login(user_data):
	session['user'] = user_data


def hash_password(password, salt):
	return hashlib.sha512(password + salt).hexdigest()

def get_cleaner(id=None, phonenumber=None):
	cleaner = None
	if id:
		cleaner = db.cleaners.find_one({"_id": ObjectId(id)})
	elif phonenumber:
		cleaner = db.cleaners.find_one({"phonenumber": phonenumber})
	return cleaner

def insert_new_cleaner(data):
	if not ('phonenumber' in data and data['password']):
		raise Exception('new cleaner data must include phonenumber and password')

	if db.cleaners.find_one({"phonenumber": data["phonenumber"]}):
		raise Exception("cleaner with phonenumber {0} already exists".format(data["phonenumber"]))

	salt = uuid.uuid4().hex
	hashed_pwd = hash_password(data["password"], salt)

	ret = db.cleaners.insert({
		"name": data["name"],
		"phonenumber": data['phonenumber'],
		"salt": salt,
		"hashed_pwd": hashed_pwd,
	})
	return ret

# TODO
def public_cleaner(cleaner):
	return {
		"_id": str(cleaner["_id"]),
		"phonenumber": cleaner["phonenumber"],
		"name": (cleaner["name"] if "name" in cleaner else None),
		"blurb": (cleaner["blurb"] if "blurb" in cleaner else None),
		"services_text": (cleaner["services_text"] if "services_text" in cleaner else None),
		"conditions_text": (cleaner["conditions_text"] if "conditions_text" in cleaner else None),
		"locations_text": (cleaner["locations_text"] if "locations_text" in cleaner else None),
		"rates_text": (cleaner["rates_text"] if "rates_text" in cleaner else None),
	}












