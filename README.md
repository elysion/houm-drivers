# houm-drivers
=========

[Houm.io](http://houm.io/) drivers for:
* [XBMC](http://kodi.tv)
* Micasa [Vera](http://getvera.com)
* [HDMI CEC](http://en.wikipedia.org/wiki/HDMI#CEC)

## Usage

Current implementation allows only one-way communication from Houm.io to drivers with the following functionality:
Vera:
* Activate scenes, toggle switches and set dimmer levels. 
HDMI CEC:
* Switch devices on or off by sending the "on f" or "standby f" commands with cec-client.
XBMC:
* Pause, resume and stop playback.

## Configuration

### Houm.io

Vera:
Add general devices and set protocol as "vera" and protocol address as:
* For devices: `device: <device id in Vera>`
* For scenes: `scene: <scene id in Vera>`

XBMC:
Add general devices and set protocol as "xbmc" and protocol address as:
* For play/pause toggle: `Player.PlayPause:toggle`
* For stop: `Player.Stop`

The current implementation sends commands to player with id 1.

HDMI CEC:
Add general devices and set protocol as "cec" and protocol address as:
* For power all toggle: `power all`

The backend gets it's configuration from environment variables:

* XBMC_HOST: XBMC host address and WebSocket port e.g. 192.168.0.1:9090
* VERA_IP: Micasa Vera ip address

As my setup is not run on the device that is connected to the HDMI network, the implementation sends the CEC commands over SSH pipe. This is done using the cec-client script in the root. In order to get the CEC commands to be sent to the correct server, replace "raspbmc" in cec-client with the device name / ip that is connected to the HDMI network.

