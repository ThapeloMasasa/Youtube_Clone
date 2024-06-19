import express from "express";
import ffmpeg from "fluent-ffmpeg";
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
//Run a post request to process the video
app.post("/process-video", (req, res) => {
    //Get path of the inout video fiile from the request
    const inputVideoPath = req.body.inputFilePath as string;
    const outputVideoPath = req.body.outputFilePath as string;

    if (!inputVideoPath || !outputVideoPath){
        res.status(400).send("Bad Request: inputFilePath or outputFilePath not defined from the request body");
    }
    //Create the ffmpeg format
    ffmpeg(inputVideoPath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
        //At the end of the process, send a success message
        res.status(200).send("Video processed Suceessfully")
        })
    .on("error", (err) => {
        //If an error occurs, log the error and send a 500 status code
        console.log(`An error has ocurred: ${err.message}`);
        res.status(500).send("An error has ocurred while processing the video: " + err.message);
    })
    .save(outputVideoPath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video Processing service listening on http://localhost:${port}`);
});