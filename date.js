exports.getDate=function (){
    let day=new Date();
    let options={
        month:"long",
        weekday:"long",
        day:"numeric"
    };
    return day.toLocaleDateString("en-us",options);
};
module.exports.getDay=function (){
    let day=new Date();
    let options={
       weekday:"long"
    };
    return day.toLocaleDateString("en-us",options);
 };
 