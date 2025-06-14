async function logout(req, res) {
   res.cookie("tokenrf", "", {
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
   })
   res.cookie("securefp", "", {
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
   })
   return res.status(200).send("Logged out successfully");
}

export default logout; 