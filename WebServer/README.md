# Tools Needed 

Install python3,pip,pipenv and postgres
Create a user and database in postgres
grant privileges to the user 

# Code
/***************************************************************/
Move to the code directory
/***************************************************************/

# Virtual Env
/***************************************************************/
create a Python 3.x virtual environment using virtualenv, like this:

$ pipenv --three


Virtual environments are a great way to move between different Python setups if you need to have multiple Python versions on your computer.  They also make migrating from one machine to another much easier.

Now, activate your newly created virtual environment:

$ pipenv shell
/***************************************************************/



# Database Configuration
/***************************************************************/
database credentials need to be set in config.py file 
/***************************************************************/



# PORT
/***************************************************************/
change port to  desired in app.py line 45
/***************************************************************/



# Executing Code
Then, you can then build and run the app as follows:

/***************************************************************/
$ pip3 install -r requirements.txt
$ export FLASK_APP=app.py
$ python manage.py db upgrade
$ python app.py
/***************************************************************/
sudo fuser -k -n tcp 80

And finally, browse to [http://localhost:{PORT}/](http://localhost:{PORT}).
