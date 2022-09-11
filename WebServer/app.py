from flask import Flask, render_template, request, abort, jsonify
import base64
from models import db, Sound
import folium
import datetime
from functools import wraps
from flask_cors import CORS
import client
import os
import csv
import glob

#import pandas as pd

app = Flask(__name__)

CORS(app)
app.config.from_object('config.DevelopmentConfig')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

SOUND_DIR = 'static/sounds/'
ERR_NO_FILE_SPECIFIED = 'error: no file specified'

db.init_app(app)


def authorize(f):
    @wraps(f)
    def decorated_function(*args, **kws):
            if not 'Authorization' in request.headers:
               abort(401)
            data = request.headers['Authorization']
            if data == app.config['API_KEY']:
                pass
            else:
                abort(403)

            return f(*args, **kws)
    return decorated_function


def html(content):  # Also allows you to set your own <head></head> etc not currently used, have it as a baseline
   return '<html><body>' + content + '</body></html>'

#def home_page():
    #return html("Server is running")

@app.route('/sound/', methods=['POST'])
def upload_sound():
    name = request.form['name']
    sound_filename = request.form['sound_filename']
    latitude = request.form['latitude']
    longitude = request.form['longitude']
    timestamp = request.form['time']
    quality_grade = request.form['grade']

    #defaulting predicted value to 0 incase
    predicted_value = 0

    file_name = f"{quality_grade}_{name}_{longitude}_{latitude}_{timestamp.replace(' ','_')}.wav"

    if 'file' not in request.files:
        return ERR_NO_FILE_SPECIFIED

    sound = request.files['file']
    if sound.filename == '':
        return ERR_NO_FILE_SPECIFIED
    _ = request.files['file'].save(dst=f"{SOUND_DIR}{file_name}")
    with open(f"{SOUND_DIR}{file_name}", "rb") as sound_file:
        encoded_string = base64.b64encode(sound_file.read())

    list_of_files = [f"{SOUND_DIR}{file_name}"]
    try:
        predicted_dicts = client.run(
            models=[app.config['CLIENT_API_MODEL']], list_of_files=list_of_files, token=app.config['CLIENT_API_TOKEN'],
            username=app.config['CLIENT_API_USERNAME'], model_version=app.config['CLIENT_API_MODEL_VERSION'],
            url=app.config['CLIENT_API_URL'])
        predicted_dict = predicted_dicts[0][app.config['CLIENT_API_MODEL']]
        if len(predicted_dict) > 0:
            predicted_value = int(int(sum(int(d['class']) for d in predicted_dict)) / len(predicted_dict))
    except Exception as ex:
        print(ex)
        predicted_value = 0

    # if want to use raw/original file use: 
    # sound
    # if want to use base64 use: 
    # encoded_string
    # here may be the classification with pyaudioanalysis?
    new_sound = Sound(name=name,
                      sound_filename=sound_filename,
                      sound_data=encoded_string,
                      latitude=latitude,
                      longitude=longitude,
                      time=timestamp,
                      sound_path=f"{SOUND_DIR}{file_name}",
                      quality=quality_grade,
                      predicted=predicted_value)
    #print(new_sound)
                    # add another column of the class (also add to migration script)?
    db.session.add(new_sound)
    db.session.commit()
    return jsonify({"response": "Done"})


@app.route("/map/", methods=["GET"])
def index():
    # SELECT * FROM files"
    # Load the pretrained models
    # Use the pretrained model
    # use HTML to visualize in the map the output/predictions
    start_coords = (38.000823, 23.816995) # Athens coordinates
    folium_map = folium.Map(location=start_coords, zoom_start=10.5)
    folium_map.save('templates/map.html') # sample map
    return render_template('index.html') # sample map


@app.route("/getData", methods=["GET"])
@authorize
def get_data():
    from_date = request.values.get('from', '2022-01-01')
    to_date = request.values.get('to', '2100-01-01')
    type = int(request.values.get('type', 1))
    data = db.session.query(Sound).options(db.defer('sound_data')).filter(Sound.time >= from_date, Sound.time <= to_date)
    if len(data.all()) > 0:
        output = {
            "status": "true",
            "message": "Records Available",
            "data": [sound_obj.serialized_get_data(type=type) for sound_obj in data.all()],
            "meta": {
                "numberOfRecords": len(data.all()),
                "numberofUniqeUserRecords": len(data.distinct(Sound.name).all()),
                "totalRecords": len(db.session.query(Sound).options(db.defer('sound_data')).all()),
                "totalUniqueUsers": len(db.session.query(Sound.name).distinct().all()),
                "from": from_date,
                "to": to_date
            }
        }
    else:
        output = {
                    "status": "false",
                    "message": "No Records Available"
                }
    return jsonify(output)

from sqlalchemy import asc, desc

@app.route("/getDates", methods=["GET"])
@authorize
def get_min_max_dates():
    max_data = db.session.query(Sound).options(db.defer('sound_data')).order_by(desc('time')).first()
    min_data = db.session.query(Sound).options(db.defer('sound_data')).order_by(asc('time')).first()
    output = {
            "max_date": max_data.time,
            "min_date": min_data.time
        }

    return jsonify(output)


@app.route("/archive", methods=["GET"])
@authorize
def archive_files_table():
    # saving backup data to csv
    csv_file_name = f"archive_files_{datetime.datetime.now().strftime('%Y-%m-%d_%H.%M.%S')}.csv"
    records = db.session.query(Sound).options(db.defer('sound_data')).all()
    with open(csv_file_name, 'w') as csvfile:
        outcsv = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

        header = Sound.__table__.columns.keys()
        header.remove('sound_data')
        outcsv.writerow(header)

        for record in records:
            outcsv.writerow([getattr(record, c) for c in header])

    # updating older records in table with newly predicted value
    list_of_files = glob.glob(os.path.join(SOUND_DIR, '*.wav'))
    predicted_value = 0
    try:
        predicted_dicts = client.run(
            models=[app.config['CLIENT_API_MODEL']], list_of_files=list_of_files, token=app.config['CLIENT_API_TOKEN'],
            username=app.config['CLIENT_API_USERNAME'], model_version=app.config['CLIENT_API_MODEL_VERSION'],
            url=app.config['CLIENT_API_URL'])
        for index, predicted_dict in enumerate(predicted_dicts):
            predicted_dict_list = predicted_dict[app.config['CLIENT_API_MODEL']]
            if len(predicted_dict_list) > 0:
                predicted_value = int(int(sum(int(d['class']) for d in predicted_dict_list)) / len(predicted_dict_list))
            sound = Sound.query.options(db.defer('sound_data')).filter_by(sound_path=list_of_files[index]).first()
            sound.predicted = predicted_value
            db.session.commit()

    except Exception as ex:
        print(ex)

    return jsonify({
        "success": True
    })


if __name__ == "__main__":
  app.run (host="::", port=5001)

