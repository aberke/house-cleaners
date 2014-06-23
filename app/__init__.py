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




from flask import Flask, send_file
from flask.ext.compress import Compress



# Configuration ----------------------------------------------

app = Flask('app')
app.config.from_object('config')
Compress(app)

# from cleaner import cleaner as cleaner_blueprint
# app.register_blueprint(cleaner_blueprint, url_prefix='/cleaner')

# from .db import get_db
# db = get_db()


#---------------------------------------------- Configuration #


@app.route('/')
@app.route('/login')
@app.route('/new/cleaner')
@app.route('/new/cleaner')
@app.route('/<cleanerName>')
def base(cleanerName=None):
	return send_file('static/html/base.html')



@app.route('/jason')
def jason_experiment():
	return send_file('static/jason/profile.html')



















