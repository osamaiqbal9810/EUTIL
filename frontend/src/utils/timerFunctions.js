import moment from "moment";
import _ from "lodash";
// export function getTimeArray(startDate , endDate , ){

// }

export function getWorkingDaysAgo(days) {
	let daysAgo = [];
	let weekendIncluded = 0;
	if ((days = 7)) {
		let today = moment().format("dddd");
		if (today == "Monday" || "Sunday") {
			weekendIncluded = 11;
		} else if (today == "Saturday") {
			weekendIncluded = 10;
		} else {
			weekendIncluded = 9;
		}

		for (let i = 0; i < weekendIncluded; i++) {
			daysAgo[i] = {
				tag: moment()
					.subtract(i, "days")
					.format("DD-MMM-YYYY"),
				time: 0,
			};
		}
		daysAgo.reverse();
	}
	return daysAgo;
}
