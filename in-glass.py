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

@app.route('/json/<device>/<year>/<month>/<day>')
def json_history_output(device, year, month, day):
	file = build_log_path(device, year, month, day)
	history = []
	if(os.path.exists(file)):
		with open(file, 'r') as log:
			log_read = csv.reader(log)
			for row in log_read:
				if(len(row) > 0):
					history.append({
									'hour': row[0],
									'minute': row[1],
									'f': row[2],
									'c': row[3]
									})
			log.close()
	return jsonify(logs=history)

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

@setInterval(900) #Log the temperature every 15 minutes
def logging_init():
	log_temperatures()

#Store as a CSV file
def log_temperatures():
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
		log = log + str(datetime.today().hour) + ',' + str(datetime.today().minute) + ',' + str(dev.get_temperature(format="fahrenheit")) + ',' + str(dev.get_temperature())
		with open(log_path, 'a') as log_file:
			log_file.write(log)
			log_file.close()

#Return a list of objects containing current temperature reading in C and F for each TEMPer device or a specific one by its ID
def get_temperatures(device = None):
	readings = [] #Building block of an API
	devs = get_devices()
	if(len(devs) > 0): #For every device if there is at least 1 connected
		for i, dev in enumerate(devs):
			if(device is None or device is i):
			    readings.append({'device': i,
			                     'c': dev.get_temperature(),
			                     'f': dev.get_temperature(format="fahrenheit"),
			                     })
	else: #Output a dummy value if no devices are connected
	    readings.append({'device': 0,
	                     'c': 20,
	                     'f': 70
	                     })
	return readings

log_temperatures() #Log the temperatures at start time
logging_init() #Then do it at our defined interval

#Only execute when called from the terminal
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)