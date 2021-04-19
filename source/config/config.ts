import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_TOKEN_EXPIRE_TIME = process.env.SERVER_TOKEN_EXPIRE_TIME || 3600;
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "waltersecret";
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "CodeIssuer";

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || "mongodb://mongo:27017";
const MONG0_DBNAME = process.env.MONG0_DBNAME || "shoplist";
const MONGO_OPTIONS = {useNewUrlParser: true, autoIndex: true};

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRE_TIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET
  }
};

const MONGO = {
  hostname: MONGO_HOSTNAME,
  dbname: MONG0_DBNAME,
  options: MONGO_OPTIONS
}

const config = {
  server: SERVER,
  mongo: MONGO
};

export default config;
