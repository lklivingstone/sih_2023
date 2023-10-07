# sih_2023

How to run?

1. Clone
```
git clone 
```

2. Install Virtual Env
```
python -m pip install --user virtualenv
```
   
3. Setup up Virtual env
```
python -m venv env
```
```
env\Scripts\activate
```
or
```
python -m venv env
```
```
source env/bin/activate
```

4. Install Dependencies
```
pip install -r requirements.txt
```

5. Start Migrating and Run Server
```
python manage.py makemigrations
```
```
python manage.py migrate
```
```
python manage.py runserver 7000
```

## If ```python``` does not work, try ```python3```
