const starstring = require('../Constants/starsdiff.js')
module.exports = (originalstars,mode) => {
    let difficulty = "";
    let osumode = "";
    if(originalstars >= 0 && originalstars < 2){difficulty = "1"}
    if(originalstars >= 2 && originalstars < 2.30){difficulty = "2"}
    if(originalstars >= 2.30 && originalstars < 2.80){difficulty = "3"}
    if(originalstars >= 2.80 && originalstars < 3.30){difficulty = "4"}
    if(originalstars >= 3.30 && originalstars < 3.75){difficulty = "5"}
    if(originalstars >= 3.75 && originalstars < 4.20){difficulty = "6"}
    if(originalstars >= 4.20 && originalstars < 4.60){difficulty = "7"}
    if(originalstars >= 4.60 && originalstars < 5.10){difficulty = "8"}
    if(originalstars >= 5.10 && originalstars < 5.60){difficulty = "9"}
    if(originalstars >= 5.60 && originalstars < 6){difficulty = "10"}
    if(originalstars >= 6 && originalstars < 6.40){difficulty = "11"}
    if(originalstars >= 6.40 && originalstars < 6.80){difficulty = "12"}
    if(originalstars >= 6.80 && originalstars < 7.30){difficulty = "13"}
    if(originalstars >= 7.30 && originalstars < 7.75){difficulty = "14"}
    if(originalstars >= 7.75){difficulty = "15"}
    if(mode == 0){osumode = "s"}
    if(mode == 1){osumode = "t"}
    if(mode == 2){osumode = "c"}
    if(mode == 3){osumode = "m"}
    
    return starstring(osumode+difficulty);
}