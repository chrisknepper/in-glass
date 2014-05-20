In-Glass
========

A Python web app which displays the temperature from a TEMPer USB device.

##Usage

1. Install by executing `python setup.py install`
2. You should get a script called `in-glass` in `/usr/local/bin/`
3. Connect your USB TEMPer thermometer to a USB port on your computer
4. Run `sudo in-glass` and visit [127.0.0.1:9000](http://127.0.0.1:9000) in your favorite browser.

##Notes

* You MUST run with `sudo` for the script to be able to access the USB device from the kernel.
* For a JSON output, append `/json` to the URL. `/json` returns celsius and fahrenheit values for each device.

##Dependencies

* [Flask](https://github.com/mitsuhiko/flask), a cool micro-framework thing.
* [temper-python/temperusb](https://github.com/padelt/temper-python), a Python library which reads values from the TEMPer thermometer.
