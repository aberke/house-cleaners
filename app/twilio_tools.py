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


from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

import config


client = TwilioRestClient(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
NUMBER = config.TWILIO_NUMBER



def send_SMS(to, body):
	""" 
	Sends SMS message to 'to' number with message 'body'
	"""
	try:
		client.messages.create(to=to, from_=NUMBER, body=body)
	except TwilioRestException as e:
		if e.code == 21211:
			raise Exception(str(to + " is not a valid phonenumber"))
		else:
			raise e










