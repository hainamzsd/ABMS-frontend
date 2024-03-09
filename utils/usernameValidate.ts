export function validateUsername(username: string): string | true {
    if (typeof username !== "string" || username.trim() === "") {
      return "Tên tài khoản không được để trống.";
    }
  
    if (username.length < 8) {
      return "Tên tài khoản phải ít nhất 8 kí tự.";
    }
  
    if (username.length > 20) {
      return "Tên tài khoản không được nhiều hơn 20 kí tự.";
    }
  
    return true; 
  }
  export function validateFullName(fullName: string): string | true {
    if (typeof fullName !== "string" || fullName.trim() === "") {
      return "Họ và tên không được trống.";
    }
  
    // Check for at least one non-whitespace character
    if (!fullName.split(/\s+/).some((part) => part.trim() !== "")) {
      return "Họ và tên không hợp lệ.";
    }
  
    return true; // Full name is valid
  }