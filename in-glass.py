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

def get_temperatures():
	#Get temperature from temper-python
	readings = [] #Building block of an API
	try:
		th = TemperHandler()
		devs = th.get_devices()
		for i, dev in enumerate(devs):
		    readings.append({'device': i,
		                     'c': dev.get_temperature(),
		                     'f': dev.get_temperature(format="fahrenheit"),
		                     })
	except USBError:
		readings.append({'device': 0,
						 'c': 0,
						 'f': 0
						 })
	finally:
		return readings

#Only execute when called from the terminal
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)