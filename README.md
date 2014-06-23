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


Analytics
===
Google analytics: https://www.google.com/analytics/web/?et&authuser=2#report/visitors-overview/a52152670w84607722p87675852/


For Alex
===

Organize
----

Front-End

base
header (show error message and logout if logged in)

/ 			   
	index.html  -> [signin]  [new]
/login
	login.html		  
/new/login
	login-new.html

/:cleanerName  -> profile page
	cleanerProfile.html
/new/cleaner
	[/new/login]
	--------------
	clenanerProfile.html



Back-End

db.py

/cleaner
/cleaner/auth/*
/cleaner/profile/*
	__init__.py  -> routes for now
	auth.py
	profile.py



TODO
===


Cleanliness
---
	- db.py -- better way of serving db and raising exception if can't init
































