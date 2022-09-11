from flask_sqlalchemy import SQLAlchemy
import datetime
# To be initialized with the Flask app object in app.py.
db = SQLAlchemy()


class Sound(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    sound_filename = db.Column(db.String())
    sound_data = db.Column(db.LargeBinary)
    latitude = db.Column(db.String())
    longitude = db.Column(db.String())
    time = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    sound_path = db.Column(db.String())
    quality = db.Column(db.Integer)

    def __repr__(self):
        return '<sound id={},name={}>'.format(self.id, self.name)



