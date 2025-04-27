const enum AppErrorCode {

    InvalidAccessToken = "InvalidAccessToken",
    MissingUserId = "MissingUserId",
    InvalidUserId = "InvalidUserId",
    MissingSessionId = "MissingSessionId",
    InvalidSessionId = "InvalidSessionId",
    MissingRefreshToken = "MissingRefreshToken",
    InvalidRefreshToken = "InvalidRefreshToken",
    MissingPassword = "MissingPassword",
    InsufficientPermission = "InsufficientPermission",
    UserNotFound = "UserNotFound",
    AccountSuspended = "AccountSuspended",
    AccountNotApproved = "AccountNotApproved",

    MissingOtpCode = "MissingOtpCode",
    InvalidOtpCode = "InvalidOtpCode",
    ExpiredOtpCode = "ExpiredOtpCode",

    MissingEmail = "MissingEmail",
    InvalidEmailFormat = "InvalidEmailFormat",
    EmailAlreadyExists = "EmailAlreadyExists",

    MissingPhoneNumber = "MissingPhoneNumber",
    InvalidPhoneNumber = "InvalidPhoneNumber",
    PhoneNumberAlreadyExists = "PhoneNumberAlreadyExists",

    MissingUsername = "MissingUsername",
    InvalidUsername = "InvalidUsername",
    UsernameAlreadyExists = "UsernameAlreadyExists",

    IncorrectPassword = "IncorrectPassword",
    PasswordTooWeak = "PasswordTooWeak",

    SessionExpired = "SessionExpired",

    MissingFields = "MissingFields",
    InvalidInput = "InvalidInput",

    UnauthorizedAccess = "UnauthorizedAccess",
    ForbiddenAccess = "ForbiddenAccess",

    InternalServerError = "InternalServerError",
    NotVerfied = "NotVerified",
}

export default AppErrorCode;