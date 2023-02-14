export default () => ({
    port: parseInt(process.env.PORT, 10) || parseInt(process.env.PORT_LOCAL, 10),
    jwt: {
        secretKey : process.env.JWT_SECRET_KEY
    }
});

// export const ENV = {
//     port : parseInt(process.env.PORT, 10) || parseInt(process.env.PORT_LOCAL, 10),
//     jwt_secret_ket : process.env.JWT_SECRET_KEY
// };
