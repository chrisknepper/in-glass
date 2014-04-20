import os, csv
from datetime import datetime
import threading
from flask import Flask, url_for, render_template, jsonify
from temperusb import TemperHandler

app = Flask(__name__)

#Output temperature on an HTML page
@app.route('/')
def main_page():
	return render_template('in-glass.html', css=url_for('static', filename='in-glass.css'), js=url_for('static', filename='in-glass.js'))

#Output temperature as a json object
@app.route('/json')
def json_output():
    return jsonify(readings=get_temperatures())

#A log for 4-20-2014 for the 0th sensor should look like logs/0/2014/4/20.csv
def build_log_path(device, year, month, day):
	return 'logs/' + str(device) + '/' + str(year) + '/' + str(month) + '/' + str(day) + '.csv'

#Return list of references to connected TEMPer devices
def get_devices():
	try:
		th = TemperHandler()
		devs = th.get_devices()
	except USBError: #Sometimes the Python driver experiences a kernel detatchment error...
		get_devices() #So try until we get it (this is probably dangerous!)
	finally:
		return devs

#Python implementation of JS-like setInterval, as a decorator to another function
#http://stackoverflow.com/questions/12435211/python-threading-timer-repeat-function-every-n-seconds/16368571#16368571
def setInterval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop(): # executed in another thread
                while not stopped.wait(interval): # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True # stop if the program exits
            t.start()
            return stopped
        return wrapper
    return decorator

#Log the temperature every 15 minutes
#Store as a CSV file
@setInterval(900)
def store_temperatures():
	year = datetime.today().year
	month = datetime.today().month
	day = datetime.today().day
	devs = get_devices()
	for i, dev in enumerate(devs):
		log_path = build_log_path(i, year, month, day)
		log = ""
		if not os.path.exists(os.path.dirname(log_path)):
			os.makedirs(os.path.dirname(log_path))
		else:
			log = log + "\n"
		log = log + str(datetime.today().hour) + ',' + str(datetime.today().minute) + ',' + dev.get_temperature(format="fahrenheit") + ',' + dev.get_temperature()
		with open(log_path, 'a') as log_file:
			log_file.write(log)
			log_file.close()

#Return a list of objects containing current temperature reading in C and F for each TEMPer device or a specific one by its ID
def get_temperatures(device = None):
	readings = [] #Building block of an API
	devs = get_devices()
	for i, dev in enumerate(devs):
		if(device is None or device is i):
		    readings.append({'device': i,
		                     'c': dev.get_temperature(),
		                     'f': dev.get_temperature(format="fahrenheit"),
		                     })
	return readings

#Start logging
store_temperatures()

#Only execute when called from the terminal
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)