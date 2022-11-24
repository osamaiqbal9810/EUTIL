export async function subdivisionChecker(user) {
  let checkSubdiv, adminCheck, subdivisionUser;
  adminCheck = user.isAdmin;
  subdivisionUser = user.subdivision;
  if (!adminCheck && (subdivisionUser && subdivisionUser !== "All")) checkSubdiv = true;
  else checkSubdiv = false;
  return checkSubdiv;
}
