export default () => ({
    port: parseInt(process.env.PORT, 10) || parseInt(process.env.PORT_LOCAL, 10),
    jwt: {
        secretKey : process.env.JWT_SECRET_KEY
    }
});