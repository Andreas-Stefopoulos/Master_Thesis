import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'KEY'
    SQLALCHEMY_DATABASE_URI = "URI"
    API_KEY = "APIKEY"
    CLIENT_API_MODEL = "sound_scape"
    CLIENT_API_MODEL_VERSION = ""
    CLIENT_API_TOKEN = "TOKEN"
    CLIENT_API_USERNAME = "USERNAME"
    CLIENT_API_URL = "URL"


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True

