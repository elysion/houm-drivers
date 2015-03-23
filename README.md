vera-houm
=========

A simple [Vera](http://getvera.com) - [Houm.io](http://houm.io/) Bridge.

## Usage

Current implementation allows only one-way communication from Houm.io to Vera. You can activate scenes, toggle switches
and set dimmer levels. In order to do this, you need to add general devices in Houm.io and set vendor address as:

* For devices: `device: <device id in Vera>`
* For scenes: `scene: <scene id in Vera>`

## Configuration

The backend gets it's configuration from environment variables:

* HOUMIO_SITE_KEY: The Houm.io site key
* VERA_IP: Vera LAN IP
# houm-drivers
