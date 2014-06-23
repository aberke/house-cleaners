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

from flask import Blueprint

from .. import db


cleaner = Blueprint('cleaner', __name__)


"""
TEMP route setup
----

GET 		/cleaner/auth 			-> return current-user
POST 		/cleaner/auth 			-> create user, login(user)
POST 		/cleaner/auth/login 	-> login(user)
POST,GET	/cleaner/auth/logout 	-> logout(user)


GET /cleaner/profile
PUT /cleaner/profile

Cleaner is the user model. Has
	phonenumber (unique)
	password

	name
	email (optional)
	pic
	blurb
"""

















