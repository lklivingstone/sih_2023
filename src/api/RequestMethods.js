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

export const documentUploading = async (data) => {
    try{
        const config = {
            data : {
                sheet : sheet,
                details : details
            }
        };
        
        const response= await publicRequest.post("api/prompt/test/", config, {
            headers: headers,
          })
        
        return {
            status: 200,
            data: response.data
        }
    }catch(err) {
        return {
            status: 400,
            message: err['response']['data']
        }
    }
}