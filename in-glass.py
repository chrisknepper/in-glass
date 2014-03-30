from flask import Flask, url_for, render_template, jsonify
app = Flask(__name__)

#In the future, we'll grab the temperature from the thermometer and store it here
temp = 50

#Building block of an API
json_values = [];
json_values.append(
		{
			'temperature': temp,
		}
	)

#Output temperature on an HTML page
@app.route('/')
def temperature_page():
    return render_template('in-glass.html', temp=temp, css=url_for('static', filename='in-glass.css'))

#Output temperature as a json object
@app.route('/json')
def temperature_json(reading=json_values):
    return jsonify(reading=json_values)

#Only execute when called from the terminal
if __name__ == '__main__':
    app.run()