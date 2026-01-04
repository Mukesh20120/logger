const createTokenUser = (user)=>{
    return {email: user.email,id: user._id, role: user.role};
}

module.exports = createTokenUser;