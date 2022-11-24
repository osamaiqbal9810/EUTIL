import moment from "moment";
export const planningTableData = [
	{
		title: "Inspection Unit 27",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.startOf("day")
			.fromNow(),
		status: "In Progress",
	},
	{
		title: "Inspection Unit 14",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.endOf("day")
			.fromNow(),
		status: "Not Started",
	},
	{
		title: "Confirmation Repait Work Unit 50",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(5, "days")
			.calendar(),
		status: "Not Started",
	},
	{
		title: "Inspection Unit 19",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.subtract(3, "days")
			.calendar(),
		status: "Finished",
	},
	{
		title: "Inspection Unit 51",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.startOf("day")
			.fromNow(),
		status: "In Progress",
	},
	{
		title: "Monthly Inspection Unit 50",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(17, "days")
			.calendar(),
		status: "On Hold",
	},
	{
		title: "Inspection Unit 140",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(12, "days")
			.calendar(),
		status: "Not Started",
	},
	{
		title: "Turn Arround Inspection 110",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(17, "days")
			.calendar(),
		status: "Not Started",
	},
	{
		title: "Level Inspection 12",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.startOf("day")
			.fromNow(),
		status: "In Progress",
	},
	{
		title: "Inspection Unit 102",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.subtract(4, "days")
			.calendar(),
		status: "In Review",
	},
	{
		title: "Confirmation Repair Work Unit 25",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.startOf("day")
			.fromNow(),
		status: "In Progress",
	},
	{
		title: "Turn around Inspection 62",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(10, "days")
			.calendar(),
		status: "Not Started",
	},
	{
		title: "Level Inspection 250",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.subtract(11, "days")
			.calendar(),
		status: "Finished",
	},
	{
		title: "Inspection & Report Unit 20",
		assignedUser: "abc@abc.com",
		assignedUserName: "John Jack",
		date: moment()
			.add(9, "days")
			.calendar(),
		status: "Not Started",
	},
];
