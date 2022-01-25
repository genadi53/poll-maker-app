import React, { useState } from "react";
import { TextField, Typography, TextareaAutosize } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CreatePool: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [choicesOptions, setChoicesOptions] = useState("");
  const [expirationDateTime, setExpirationDateTime] = useState("");

  // let navigate = useNavigate();

  return (
    <div>
      <Typography variant="h3" className="title">
        Create Poll
      </Typography>

      <TextField
        id="question-required"
        label="Question"
        value={question}
        style={{ width: 200 }}
        onChange={(e) => {
          setQuestion(e.target.value);
        }}
        // defaultValue="Hello World"
      />
      <TextField
        id="datetime-local"
        label="Expiration Date Time"
        type="datetime-local"
        defaultValue="2020-05-24T10:30"
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
};
