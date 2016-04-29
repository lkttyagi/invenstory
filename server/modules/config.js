// exports.db = { url:      process.env.DB_URL || 'localhost',
//                     name:     process.env.DB_NAME || 'invenstory_db',
//                     username: process.env.DB_USER || null,
//                     password: process.env.DB_PASSWORD || null
//                   }
exports.webServer = {
                    port: process.env.PORT || 8080
}

exports.state = {
                    env: process.env.NODE_ENV || 'development',
}

exports.amazonEnv = {
                    accessKeyId:      process.env.MWS_ACCESS_KEY_ID || null,
                    secretAccessKey:  process.env.MWS_SECRET_KEY || null,
                    merchantId:       process.env.MWS_MERCHANT_ID || null,
                    marketplaceId:    process.env.MWS_MARKETPLACE_ID || "ATVPDKIKX0DER"
}

exports.amazonAuth = {
                    clientId:      process.env.AUTH_CLIENT_ID || null,
                    clientSecret:  process.env.AUTH_CLIENT_SECRET || null,
                    callbackURL:   process.env.AUTH_CALLBACK_URL || "http://localhost:8080/auth/amazon/callback"
}

exports.jwtConfig = {
                    secret: 'doobydoobydooo'
}

 exports.db = require('knex')(require('../../knexfile.js')[exports.state.env])
