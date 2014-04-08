In-Glass
========

A Python web app which displays the temperature from a TEMPer USB device.

##Usage

Execute `sudo python in-glass.py` and visit [127.0.0.1:9000](http://127.0.0.1:9000) in your favorite browser.
Currently, the root URL displays the fahrenheit reading of the first device, if there is one.
For a JSON output, append `/json` to the URL. `/json` returns celsius and fahrenheit values for each device.

##Dependencies

[Flask](https://github.com/mitsuhiko/flask), a cool micro-framework thing.
[temper-python/temperusb](https://github.com/padelt/temper-python), a Python library which reads values from the TEMPer thermometer.
