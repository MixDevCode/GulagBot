module.exports = (ranked_score) => {

    function GetLevel(score) {
        var i = 1;
        for (;;) {
            var lScore = GetRequiredScoreForLevel(i);
            if (score < lScore) {
                return i - 1;
            }
            i++;
        }
    }

    function GetRequiredScoreForLevel(level) {
        if (level <= 100) {
            if (level > 1) {
                return Math.floor(5000/3*(4*Math.pow(level, 3)-3*Math.pow(level, 2)-level) + Math.floor(1.25*Math.pow(1.8, level-60)));
            }
            return 1;
        }
        return 26931190829 + 100000000000*(level-100);
    }

return GetLevel(ranked_score)

}