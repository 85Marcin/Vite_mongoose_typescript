"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
mongoose_1.default.connect(process.env.MONGO_URI);
const personSchema = new mongoose_1.Schema({ name: String });
const Person = mongoose_1.default.model("Person", personSchema);
// const john = new Person({ name: "John" })
// john.save()
app.get("/", (req, res) => {
    res.send("Server running");
});
app.get("/api/people", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const peopleFromDatabase = yield Person.find();
        res.json(peopleFromDatabase);
    }
    catch (error) {
        console.error("Error fetching people from the database:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/api/people/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const person = yield Person.findById(id);
        if (!person) {
            return res.status(404).json({ error: "Person not found" });
        }
        res.json(person);
    }
    catch (error) {
        console.error("Error fetching person from the database:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.post("/api/people", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const newPerson = new Person({ name });
        yield newPerson.save();
        res.status(201).json(newPerson);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding person" });
    }
}));
app.delete("/api/people/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const personToDelete = yield Person.findById(id);
        if (!personToDelete) {
            return res.status(404).json({ error: "Person not found" });
        }
        yield Person.deleteOne({ _id: personToDelete._id });
        res.json({ message: "Person deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting person from the database:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
