# Useful-JS-Function

This is a simple library contain different kind of useful function.

## Install

```
npm install --save simple-yolo-library
```

## API
### .get_timezones()
  Returns a array of all the timezones.

**Example**

```javascript
const Times = require('simple-yolo-library').Times;

const timezones = Times.get_timezones();

```

### .current_location_time(type,option,timezone_name)
  Returns a string base on the parameter.

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| type | string | **require** | time / date / full |
| optoin | object | **require** | addition condition to render date string |
| timezone_name | string | **require** | "" or timezone from .get_timezones() |

#### optoin parameter
| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| time_format | string | "24" | "12" / "24" |
| separators | string | "/" | any string to sperate the date ex. 02/25/2020 with "/" |
| order | array | ["mm","dd","yyyy"] | date string order included "m", "mm", "mmm", "d", "dd", "yy","yyyy"|

**Example**

```javascript
const Times = require('simple-yolo-library').Times;

const timezones = Times.current_location_time("full",{time_format:"12",separators:"/",order:["mmm","dd","yyyy"]},"Asia/Taipei");

// output => 'Feb/29/2020 07:21:21 AM'

```
