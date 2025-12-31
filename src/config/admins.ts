export const ADMIN_LIST = [
  "glamourboutique377@gmail.com", 
  "secondadmin@gmail.com" // Just add more here!
];

export const isUserAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_LIST.includes(email.toLowerCase().trim());
};