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
        this._validator.validatePostAuthenticationPayload(request.payload);
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
        response.code(201);
        return response
    }

    //! get new access token
    async putAuthenticationHandler(request){
        this._validator.validatePutAuthenticationPayload(request.payload);
        const {refreshToken} = request.payload;

        await this._authenticationService.verifyRefreshToken(refreshToken);

        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generatedAccessToken({id});
        return {
            status:'success',
            message:'Access Token berhasil di perbaharui',
            data:{
                accessToken
            }
        }
    }

    //!logout   
    async deleteAuthenticationHandler(request){
        this._validator.validateDeleteAuthenticationPayload(request.payload);

        const {refreshToken} = request.payload
        await this._authenticationService.verifyRefreshToken(refreshToken);
        await this._authenticationService.deleteRefreshToken(refreshToken);

        return {
            status:'success',
            message:'Refresh token berhasil dihapus'
        }
    }

    
}

module.exports = AuthenticationHandler