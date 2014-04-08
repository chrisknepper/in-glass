from flask import Flask, url_for, render_template, jsonify
from temperusb import TemperHandler

app = Flask(__name__)

#Output temperature on an HTML page
@app.route('/')
def main_page():
	temp = 0
	temps = get_temperatures()
	if(len(temps) > 0):
		temp = temps[0].f
	return render_template('in-glass.html', temp=temp, css=url_for('static', filename='in-glass.css'))

#Output temperature as a json object
@app.route('/json')
def json_output():
    return jsonify(readings=get_temperatures())

def get_temperatures():
	#Get temperature from temper-python
	th = TemperHandler()
	devs = th.get_devices()
	readings = [] #Building block of an API
	for i, dev in enumerate(devs):
	    readings.append({'device': i,
	                     'c': dev.get_temperature(),
	                     'f': dev.get_temperature(format="fahrenheit"),
	                     })
	return readings

#Only execute when called from the terminal
if __name__ == '__main__':
    app.run(port=9000, debug=True)