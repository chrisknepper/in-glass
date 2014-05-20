#!/bin/env python
# -*- coding: utf8 -*-

from setuptools import setup

version = "0.1"

setup(
    name="inglass",
    version=version,
    description="A tool for monitoring and logging the temperature from a TEMPer USB Thermometer",
    keywords="temperature flask temper usb logging",
    packages=["inglass"],
    author="Chris Knepper, Lance Laughlin, Dustin Raimondi",
    author_email="chris82thekid@gmail.com",
    url="https://github.com/chrisknepper/in-glass",
    license="LICENSE",
    include_package_data = True,
    zip_safe = False,
    install_requires=[
        "Flask",
        "temperusb",
        "pyyaml"
    ],
    entry_points={
        'console_scripts': [
            'in-glass = inglass.inglass:startup'
        ]
    }
)