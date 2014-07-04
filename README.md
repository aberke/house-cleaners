house-cleaners
==============

Significance Labs project prototype - Pages for house cleaners

Running Locally
---

* Clone repo 

```
$ git clone https://github.com/aberke/house-cleaners.git
$ cd /house-cleaners
```

* Create a virutual environment so that the following installations do not cause conflicts.  Make sure to reactivate this virtual environment each time you want to run the server locally.  All the following installations will be isolated in this environment.

```
$ pip install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```

* Install dependencies: ```$ pip install -r requirements.txt``` (may need to run with sudo)
* Make sure you have mongodb installed ```$ brew install mongodb```
* Make sure mongodb is started ```$ mongod```

* Run server ```python run.py``` and visit<http://127.0.0.1:3000>


Running The Tests
---
From the base directory ```python test.py```


Analytics
---
Google analytics: https://www.google.com/analytics/web/?et&authuser=2#report/visitors-overview/a52152670w84607722p87675852/


Production Notes
===

- on Heroku under berke.alexandra@gmail.com account
	- free tier
	- Take off Bill's credit card (went on for MongoHQ but shouldn't be charging anything)

- MongoHQ
	- free tier

Image File Uploads
---

- Using shared annie@significancelabs.org AWS account
	- keys belong to user alex who belongs to group breathingspace
- Storing files in /cleaners/pics bucket 
	- file keys match cleaner _id's


For Alex
===

Organize
----

Front-End

base

/ 			   
	index.html  -> [new] [signin] 
/sign-in
	sign-in.html
/reset-password
	reset-password.html

/profile/:phonenumber  -> profile page
	profile.html
/new
	[/new/login]
	--------------
	clenanerProfile.html



Back-End

database.py

/cleaner
/cleaner/auth/*
/cleaner/profile/*
	__init__.py  -> routes for now
	auth.py
	profile.py



TODO
---

- refactor

- admin whitelist

- validating phonenumber client-side throughout sign-in flow

- never return entire profile in response -- dump public version

- exception middleware - utilize after_request


- Take Bill's card off heroku account

- make /new responsive
	- use showAll=true

















