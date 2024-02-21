export const validatePassword = (password : string): boolean => {
    // Regular expression to match the password criteria
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{8,}$/;
    return passwordPattern.test(password);
};