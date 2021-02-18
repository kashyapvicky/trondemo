function countdown(end, now =new Date().getTime()/1000) {
    // Get today's date and time
    var distance = (end - now)* 1000;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (String(seconds).length === 1) seconds = '0' + seconds;
    if (String(minutes).length === 1) minutes = '0' + minutes;
    if (String(hours).length === 1) hours = '0' + hours;
    if (String(days).length === 1) days = '0' + days;
    // Display the result in the element with id="demo"
    return days + ":" + hours + ":" + minutes + ":" + seconds + "";
}


function aviable(date_withdraw, date_end, amount, now= new Date().getTime()) {

    let time = now <= date_end ? now - date_withdraw : date_end - date_withdraw;

    let pay = ((amount * 2) / 864000) * time;
    return pay;
}