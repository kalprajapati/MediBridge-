import bcrypt from "bcrypt";

const generateHash = async () => {
    const password = "kalp@123"; // your password

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log("Hashed Password:");
    console.log(hash);
};

generateHash();