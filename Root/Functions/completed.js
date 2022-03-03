module.exports = (time_elapsed, total_length) => {
    const completed = ((time_elapsed/1000)/total_length)*100;
    const min = 0;
    const max = 100;
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    var clamped = clamp(completed, min, max);
    return Number(clamped.toFixed(2))
}