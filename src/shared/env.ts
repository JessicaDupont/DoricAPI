export const PORT = process.env.PORT ?? process.env.PORT_LOCAL;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const DB = {
    "HOST": process.env.DB_HOST ?? process.env.DB_HOST_LOCAL,
    "PORT": parseInt(process.env.DB_PORT ?? process.env.DB_PORT_LOCAL, 10),
    "USERNAME": process.env.DB_USERNAME ?? process.env.DB_USERNAME_LOCAL,
    "PASSWORD": process.env.DB_PASSWORD ?? process.env.DB_PASSWORD_LOCAL,
    "NAME": process.env.DB_NAME ?? process.env.DB_NAME_LOCAL
}