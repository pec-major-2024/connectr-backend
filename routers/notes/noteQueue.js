import { Worker } from "bullmq";
import axios from "axios";
import NoteEmotion from "../../models/NoteEmotion.js";

const noteQueue = new Worker('note-queue', async (job) => {
    const raw_text = job.data?.raw_text;
    const noteId = job.name;
    console.log("===Creating note emotion for the note id:", job.name, "===");
    try {
        const response = await axios.post(`${process.env.CONNECTR_AI_SERVICE_URL}/predict?raw_text=${raw_text}`);
        const { probability_dict, most_common_words } = response.data;
        const noteEmotion = new NoteEmotion({
            noteId,
            emotion: probability_dict,
            keywords: most_common_words
        });
        await noteEmotion.save();
        console.log("Note emotion saved successfully:", noteEmotion);
    } catch (err) {
        console.error("Error creating note emotion:", err);
        return { success: false, error: err.message };
    }
    // call localhost:8080/predict
    // save the data in note emotion
},
    {
        connection: {
            host: process.env.QUEUE_REDIS_HOST,
            port: process.env.QUEUE_REDIS_PORT,
            username: process.env.QUEUE_REDIS_USERNAME,
            password: process.env.QUEUE_REDIS_PASSWORD,
        }
    }
)

export default noteQueue;