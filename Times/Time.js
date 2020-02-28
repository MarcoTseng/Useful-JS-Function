/* Time.js */
var countryTimezone = require('countries-and-timezones');

const Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/* Prepend the zero if number is not two digit */
function two_digit(input_num) 
{

    if(typeof input_num != "number")
        throw new Error("The input data Type is incorrect");
    else
    {
        if(input_num < 10)
            return "0" + input_num;
        else
            return input_num.toString();
    }
}

/* Validate the input type */
function check_type(args,type_array) 
{
    
    for(var index = 0; index < args.length; index ++)
    {
        if(typeof args[index] != type_array[index])
            return false;
    }

    return true;
}

/* get all timezones */
function get_timezones()
{
    var timezones = countryTimezone.getAllTimezones();

    return Object.keys(timezones);
}

/* get hour offset */
function get_hour_difference(timezone_name)
{
    if(!check_type([timezone_name],["string"]))
        throw new Error("The input is incorrect !");

    try {
        var timezone_obj = countryTimezone.getTimezone(timezone_name);

        var date_obj = new Date();

        var location_offset = -1 * timezone_obj.utcOffset;

        return date_obj.getTimezoneOffset() - location_offset;
    }
    catch (e) {
        throw new Error("timezone not found !");
    }
}

/* get current time */
function get_current_time(dateObject,type) 
{
    if(!check_type([type],["string"]))
        throw new Error("The input is incorrect !");

    var AM_PM = "AM";

    var hours = dateObject.getHours();

    var minutes = dateObject.getMinutes();

    var seconds = dateObject.getSeconds();

    if(type === "24")
        return two_digit(hours) + ":" + two_digit(minutes) + ":" + two_digit(seconds);
    else if(type === "12")
    {
        if(hours > 12)
            return two_digit(hours-12) + ":" + two_digit(minutes) + ":" + two_digit(seconds) + " PM";
        else
            return two_digit(hours) + ":" + two_digit(minutes) + ":" + two_digit(seconds) + " AM";
    }
    else
        throw new Error("The Time format is not support !");
}

/* get current date */
function get_current_date(dateObject,separators,order) 
{
    if(!check_type([separators,order],["string","object"]) || !Array.isArray(order))
        throw new Error("The input is incorrect !");

    var m_flag = false;

    var d_flag = false;

    var y_flag = false;

    for(var index = 0; index < order.length; index ++)
    {
        if(index >= 3)
            throw new Error("The input is incorrect !");

        switch(order[index])
        {
            case 'm' :
                if(m_flag) throw new Error("The input is incorrect !");
                order[index] = (dateObject.getMonth() + 1).toString();
                m_flag = true;
                break;
            case 'mm' :
                if(m_flag) throw new Error("The input is incorrect !");
                order[index] = two_digit(dateObject.getMonth() + 1);
                m_flag = true;
                break;
            case 'mmm' :
                if(m_flag) throw new Error("The input is incorrect !");
                order[index] = Months[dateObject.getMonth()];
                m_flag = true;
                break;
            case 'd' :
                if(d_flag) throw new Error("The input is incorrect !");
                order[index] = (dateObject.getDate()).toString();
                d_flag = true;
                break;
            case 'dd' :
                if(d_flag) throw new Error("The input is incorrect !");
                order[index] = two_digit(dateObject.getDate());
                d_flag = true;
                break;
            case 'yy' :
                if(y_flag) throw new Error("The input is incorrect !");
                order[index] = (dateObject.getFullYear() % 100).toString();
                y_flag = true;
                break;
            case 'yyyy' :
                if(y_flag) throw new Error("The input is incorrect !");
                order[index] = (dateObject.getFullYear()).toString();
                y_flag = true;
                break;
            default :
                throw new Error("The input is incorrect !");
        }

    }

    if(order.length == 0)
        throw new Error("Order can not be empty !");

    return order.join(separators);
}

/* main function to get location time */
function current_location_time(type,option,timezone_name) 
{

    if(!check_type([type,option,timezone_name],["string","object","string"]))
        throw new Error("The input is incorrect !");

    var date_obj = new Date();

    if(timezone_name != "")
    {
        var hours_diff = get_hour_difference(timezone_name) /60;
        
        date_obj.setHours(date_obj.getHours() + hours_diff);
    }

    // setup default option
    var _option = {
        time_format : option.time_format || "24",
        separators : option.separators || "/",
        order : option.order || ["mm","dd","yyyy"]
    };
    
    if(type === "time")
        return get_current_time(date_obj,_option.time_format);
    else if(type === "date")
        return get_current_date(date_obj,_option.separators,_option.order);
    else if(type === "full")
        return get_current_date(date_obj,_option.separators,_option.order) + " " + get_current_time(date_obj,_option.time_format);
    else
        throw new Error("The input is incorrect !");
}

module.exports = {
    get_timezones,
    current_location_time
};