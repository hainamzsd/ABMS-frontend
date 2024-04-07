import * as yup from "yup";

// Room Information
export const roomSchema = yup.object().shape({
  roomNumber: yup.string().required("Số căn hộ là bắt buộc"),
  roomArea: yup
    .number()
    .required("Diện tích căn hộ là bắt buộc")
    .positive("Diện tích căn hộ phải dương"),
});

// Member Information
export const memberSchema = yup.object().shape({
  fullName: yup.string().required("Họ và tên là bắt buộc"),
  dob: yup
    .string()
    .required("Ngày sinh là bắt buộc")
    .matches(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
      "Ngày sinh không hợp lệ (mm/dd/yyyy)"
    ),
  gender: yup.string().required("Giới tính là bắt buộc"),
  phone: yup
    .string()
    .required("Số điện thoại không được trống")
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(10, "Số điện thoại không được nhiều hơn 10 chữ số"),
});

// Building Information
export const buildingSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên tòa nhà không được trống")
    .max(20, "Địa chỉ không được quá 20 ký tự"),
  address: yup
    .string()
    .required("Địa chỉ tòa nhà không được trống")
    .max(50, "Địa chỉ không được quá 50 ký tự"),
  number_of_floor: yup
    .number()
    .required("Số tầng không được trống")
    .positive("Số tầng phải là số dương"),
  room_each_floor: yup
    .number()
    .required("Số căn hộ mỗi tầng không được trống")
    .positive("Số căn hộ mỗi tầng phải là số dương"),
});

//Bill Information
export const billSchema = yup.object().shape({
  description: yup.string().max(100, "Mô tả hoá đơn không được quá 100 ký tự"),
});

// Post Information
export const postSchema = yup.object().shape({
  title: yup
    .string()
    .required("Tiêu đề bài viết là bắt buộc")
    .max(30, "Tiêu đề bài viết không được quá 30 ký tự"),
  content: yup.string().required("Nội dung bài viết là bắt buộc"),
  type: yup.string().required("Bắt buộc phải chọn kiểu bài viết"),
  image: yup.string().required("Ảnh bài viết là bắt buộc"),
});

// Utility Information
export const utilitySchema = yup.object().shape({
  name: yup.string().required("Tên tiện ích là bắt buộc"),
  numberOfSlot: yup
    .number("Số khung giờ phải là số")
    .required("Số khung giờ là bắt buộc")
    .positive("Số khung giờ phải nhiều hơn 0")
    .max(6, "Số khung giờ không thể nhiều hơn 6"),
  pricePerSlot: yup
    .number("Số khung giờ phải là số")
    .required("Giá mỗi khung giờ là bắt buộc")
    .positive("Giá mỗi khung giờ phải lớn hơn 0"),
  //   openTime: yup
  //     .string()
  //     .required("Thời gian bắt đầu là bắt buộc")
  //     .matches(
  //       /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/,
  //       "Thời gian bắt đầu không hợp lệ (h:mm AM/PM)"
  //     ),
  //   closeTime: yup
  //     .string()
  //     .required("Thời gian kết thúc là bắt buộc")
  //     .matches(
  //       /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/,
  //       "Thời gian kết thúc không hợp lệ (h:mm AM/PM)"
  //     ),
});

// Time Schema
const timeSchema = yup
  .string()
  .required("Thời gian là bắt buộc")
  .matches(
    /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/,
    "Thời gian không hợp lệ (h:mm AM/PM)"
  );
// Schema cho openTime và closeTime
export const openingHoursSchema = yup
  .object()
  .shape({
    openTime: timeSchema,
    closeTime: timeSchema,
  })
  .test(
    "is-before",
    "Thời gian bắt đầu phải trước thời gian kết thúc",
    function (values) {
      const { openTime, closeTime } = values;
      if (!openTime || !closeTime) {
        // Bỏ qua nếu một trong hai không được cung cấp
        return true;
      }
      // Parse thời gian thành đối tượng Date để so sánh
      const openDate = new Date(`2000-01-01T${openTime}`);
      const closeDate = new Date(`2000-01-01T${closeTime}`);
      // Kiểm tra nếu openTime trước closeTime
      return openDate < closeDate;
    }
  );

// const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
// await billSchema.validate({ description: description }, { abortEarly: false })
// if (error.name === 'ValidationError') {
//     const errors: any = {};
//     error.inner.forEach((err: any) => {
//         errors[err.path] = err.message;
//     });
//     setValidationErrors(errors);
// }
