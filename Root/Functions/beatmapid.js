module.exports = (link) => {
    let beatmapid;
    let mode;
    if (link.startsWith("https://osu.ppy.sh/b/")) {
        let a_mode_list = [0, 1, 2, 3]
        let args1 = link.split('/')[4].split(' ')[0].split('?')
        beatmapid = args1[0]
        mode = args1[1] ? a_mode_list[args1[1].substr(-1)] : '0'
        return {id_beatmap: beatmapid, mode: mode}    
    } else if (link.startsWith("https://osu.ppy.sh/beatmapsets/")) {
        let a_mode_list = {"osu": 0, "taiko": 1,
                            "fruits": 2, "mania": 3}
        let args1 = link.split('#')[1].split('/')
        beatmapid = args1[1].split(" ")[0]
        mode = a_mode_list[args1[0]]
        return {id_beatmap: beatmapid, mode: mode}
    }
}