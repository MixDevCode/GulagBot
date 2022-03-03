module.exports = (status) => {
    const mapstatus = {
		"-1" : "Not Submitted",
		 "0" : "Pending",
		 "1" : "Update Available",
		 "2" : "Ranked",
		 "3" : "Approved",
		 "4" : "Qualified",
		 "5" : "Loved"
		}
    return mapstatus[status];
}