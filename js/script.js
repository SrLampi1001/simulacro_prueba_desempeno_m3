const user = JSON.parse(sessionStorage.getItem("user"))
if(user !== null){
    let regexAdmin = /admin/
    if(user.role === "admin"){
        if (!regexAdmin.test(location.pathname)) location = "./admin"
    } else{
        location = "./"
    }
} else{
    location.pathname = "./log_in.html"
}