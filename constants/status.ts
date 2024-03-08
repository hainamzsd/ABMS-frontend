type StatusUtility = {
  [key: number]: { status: string; color: string };
};

const statusUtility: StatusUtility = {
  2: {
    status: "Pending",
    color: "#E7E49C"
  },
  3: {
    status: "Success",
    color: "#AEBB81"
  }, 
  4: {
    status: "Unsuccess",
    color: "#ED6666"
  },
};
export default statusUtility