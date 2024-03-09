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

const statusForReceptionist: StatusUtility = {
  2: {
    status: "Đang chờ",
    color: "#E7E49C"
  },
  3: {
    status: "Chấp nhận",
    color: "#AEBB81"
  }, 
  4: {
    status: "Không chấp nhận",
    color: "#ED6666"
  },
};
export  {statusUtility, statusForReceptionist}