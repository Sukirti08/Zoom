import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";
const login = async (req, res) => {

    const { username, password } = req.body;

    if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" })
        }


        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        return res.status(500).json({ message: "Server error." })
    }
}


const register = async (req, res) => {
    const { name, username, password } = req.body;
    if (![name, username, password].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ message: "Name, username, and password are required." });
    }


    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        res.status(500).json({ message: "Server error." })
    }

}


const getUserHistory = async (req, res) => {
    const { token } = req.query;
    if (typeof token !== "string" || !/^[a-f0-9]{40}$/.test(token)) {
        return res.status(401).json({ message: "Sign in to continue." });
    }

    try {
        const user = await User.findOne({ token });
        if (!user) return res.status(401).json({ message: "Sign in to continue." });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.status(500).json({ message: "Server error." })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    if (typeof token !== "string" || !/^[a-f0-9]{40}$/.test(token)) {
        return res.status(401).json({ message: "Sign in to continue." });
    }

    try {
        const user = await User.findOne({ token });
        if (!user) return res.status(401).json({ message: "Sign in to continue." });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.status(500).json({ message: "Server error." })
    }
}


export { login, register, getUserHistory, addToHistory }