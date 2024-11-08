const autoBind = require("auto-bind");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationHandler {
    constructor(authenticationService, usersService, tokenManager, validator){
        this._authenticationService = authenticationService 
        this._usersService = usersService 
        this._tokenManager = tokenManager 
        this._validator = validator
        autoBind(this);
    }
    
    //!Login
    async postAuthenticationHandler(request, h){
        this._validator.validatePostAuthenticationPayload(request.payload)
        const {username, password} = request.payload
        const id = await this._usersService.verifyUserCredential(username, password);
        
        
        const accessToken  = this._tokenManager.generatedAccessToken({id});
        const refreshToken = this.  _tokenManager.generatedRefreshToken({id});
        
        await this._authenticationService.addRefreshToken(refreshToken);

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