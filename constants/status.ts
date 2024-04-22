type StatusUtility = {
  [key: number]: { status: string; color: string };
};


const statusUtility: StatusUtility = {
  1: {
    status: "Active",
    color: "#AEBB81"
  },
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
  7: {
    status: "Responded",
    color: "#AEBB81"
  },
};

const accountStatus: StatusUtility = {
  1: {
    status: "Đang hoạt động",
    color: "#276749"
  },
  0: {
    status: "Không hoạt động",
    color: "#9c9c9c"
  },
}

const statusForReceptionist: StatusUtility = {
  0:{
    status: "Vô hiệu hóa",
    color: "#808080"
  },
  1: {
    status: "Đã xác minh",
    color: "#276749"
  },
  2: {
    status: "Đang chờ",
    color: "#ca8a04"
  },
  3: {
    status: "Chấp nhận",
    color: "#276749"
  }, 
  4: {
    status: "Không chấp nhận",
    color: "#9b2c2c"
  },
 
};
export  {statusUtility, statusForReceptionist, accountStatus}