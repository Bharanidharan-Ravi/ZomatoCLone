import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const header = (props) => {
    let onSuccess = (credentialResponse) => {
    let token = (credentialResponse.credential);
    try {
        let data = jwt_decode(token);
        localStorage.setItem("zc_auth_token", token);
        alert("Login Successfully");
        window.location.reload();
    } catch (error) {
        localStorage.removeItem("zc_auth_token");
        console.log(error);
    }
    }
    let onError = () => {
        console.log('Login Failed');
    }
    let Logout = () =>{
        let onLogout = window.confirm("Are you sure to logout");
        if(onLogout){
        localStorage.removeItem("zc_auth_token");
        window.location.reload();
        }
    }
    return(
        <>
        <GoogleOAuthProvider clientId="273792992667-8s94fkt5larps2v25ge7j283241p94bd.apps.googleusercontent.com">
        <div className="modal fade" id="login/SignUp" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
         <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Login / SignUp</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            <div className="modal-body">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                />;
            </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
        <div className="col-10 d-flex justify-content-between py-2">
            {props.logo === false ? <p></p> : <p className="m-0 brand">e!</p> }
            <div>
                {
                    props.user ?
                     (<><button className="btn btn-light">Welcome , {props.user.name}</button>  
                        <button className="btn btn-warning mx-2" onClick={Logout}>Logout</button>
                     </>
                    ) :(<button className="btn btn-outline-light" data-bs-toggle = "modal" data-bs-target = "#login/SignUp">
                    Login / SignUp</button>)
                }
              
             
            </div>
          </div>
          </GoogleOAuthProvider>
        </>
    )
};
export default header