import pkg from "pg";
import config from "./config.js";

const { Pool } = pkg;

const pool = new Pool(config.postgre);

export default pool;
