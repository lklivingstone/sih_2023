import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../redux/UserRedux";

const BASE_URL= "http://127.0.0.1:7000/";
const TOKEN= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDJlNTNiMzgzODM0ZjQxMmEyOGM1NSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY2NjYwMDgzOSwiZXhwIjoxNjY2NjE4ODM5fQ.GFpDpnMA2eSHm1GVzfZeGGW3--cc2nVTRFIHkb2BSgE"

export const publicRequest= axios.create({
    baseURL: BASE_URL,
});

export const authRequest= axios.create({
    baseURL: BASE_URL,
    header: { Authorization: `Bearer ${TOKEN}`}
})

export const login = async (dispatch, user) => {
    dispatch(loginStart())

    try{
        const res= await publicRequest.post("/api/auth/login/", user)
        console.log(res.data['data'])
        dispatch(loginSuccess(res.data["data"]))
    }catch(err) {
        dispatch(loginFailure())
    }
}

export const register = async (user) => {
    try{
        user= {
            username: user['username'],
            email: user['email'],
            password: user['password'],
            first_name: user['first_name'],
            last_name: user['last_name'],
        }

        const response= await publicRequest.post("/api/auth/register/", user)

        console.log(response)
        return {
            status: 201,
            message: response.data
        }
    }catch(err) {
        console.log(err)
        return {
            status: 400,
            // message: err['response']['data']
        }
    }
}


// export const documentUploading = async (data) => {
//     try{
//         const config = {
//             data : {
//                 sheet : sheet,
//                 details : details
//             }
//         };
        
//         const response= await publicRequest.post("api/prompt/test/", config, {
//             headers: headers,
//           })
        
//         return {
//             status: 200,
//             data: response.data
//         }
//     }catch(err) {
//         return {
//             status: 400,
//             message: err['response']['data']
//         }
//     }
// }