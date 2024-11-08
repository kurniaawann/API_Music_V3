const autoBind = require("auto-bind");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationHandler {
    constructor(authenticationService, usersService, tokenManager, validator){
        this._authenticationService = authenticationService 
        this._usersService = usersService 
        this._tokenManager = tokenManager 
        this._validator = validator
        if (!this._authenticationService || !this._usersService || !this._tokenManager || !this._validator) {
            console.error("Dependencies not initialized correctly:", {
                authenticationService: this._authenticationService,
                usersService: this._usersService,
                tokenManager: this._tokenManager,
                validator: this._validator
            });
            console.log('error disini cuyy');
         
        };
        autoBind(this);
    }
    
    //!Login
    async postAuthenticationHandler(request, h){
        this._validator.validatePostAuthenticationPayload(request.payload)
        const {username, password} = request.payload
        const id = await this._usersService.verifyUserCredential(username, password);
        
        
        const accessToken  = this._tokenManager.generatedAccessToken(id);
        const refreshToken = this.  _tokenManager.generatedRefreshToken(id);
        
        console.log(id);
        console.log(accessToken);
        console.log('refresh token,', refreshToken);


        try {
            await this._authenticationService.addRefreshToken(refreshToken);
        } catch (error) {
            console.error("Error adding refresh token:", error);
            throw error; // Jika perlu, lempar kembali error untuk penanganan lebih lanjut
        }

        const response = h.response({
            status:'success',
            message:'berhasil Login',
            data:{  
                accessToken,
                refreshToken
            }
        });
        response.code(200)
        return response
    }

    
}

module.exports = AuthenticationHandler