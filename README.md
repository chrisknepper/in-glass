In-Glass
========

A Python web app which will display the temperature from a TEMPer USB device.
Currently we just use a placeholder value.

##Usage

Execute `python in-glass.py` and visit [127.0.0.1:5000](http://127.0.0.1:5000) in your favorite browser.
For a JSON output, append `/json` to the URL.

##Dependencies

[Flask](https://github.com/mitsuhiko/flask), a cool micro-framework thing.
[TEMPered](https://github.com/edorfaus/TEMPered), a C library which reads values from the TEMPer thermometer.
