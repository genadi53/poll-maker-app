import React, { useState } from "react";
import { TextField, Typography, TextareaAutosize, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useMeQuery, useCreatePoolMutation } from "../generated/graphql";
import { getAccessToken } from "../accessToken";

export const CreatePool: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [numberOfChoices, setNumberOfChoices] = useState(2);
  const [choices, setChoices] = useState([
    {
      text: "",
    },
    {
      text: "",
    },
  ]);
  const [expirationDateTime, setExpirationDateTime] =
    useState("2020-05-24T10:30");
  const [createPool] = useCreatePoolMutation();
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });

  const addChoice = () => {
    setChoices((currChoices) => {
      return [
        ...currChoices,
        {
          text: "",
        },
      ];
    });
  };

  const removeChoice = (choiceNumber: number) => {
    const c = choices.slice();
    setChoices([...c.slice(0, choiceNumber), ...c.slice(choiceNumber + 1)]);
  };

  const handleChoiceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) => {
    const c = choices.slice();
    c[index] = { text: e.target.value };
    setChoices(c);
  };

  return (
    <div>
      <Typography variant="h3" className="title">
        Create Poll
      </Typography>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const choicesStr = "";
          choices.forEach((c) => choicesStr.concat(c.text).concat("-"));

          if (!data || loading) {
            console.log("F");
          }
          console.log(data);
          const res = await createPool({
            variables: {
              question,
              expirationDateTime,
              choicesOptions: choicesStr,
            },
            context: {
              Headers: {
                authorization: `bearer ${getAccessToken()}`,
              },
            },
          });
          console.log(res);
        }}
      >
        <Stack spacing={2}>
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
            value={expirationDateTime}
            onChange={(e) => {
              setExpirationDateTime(e.target.value);
              console.log(e.target.value);
            }}
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <button
            onClick={() => {
              if (numberOfChoices < 5) {
                setNumberOfChoices((curr) => curr + 1);
                addChoice();
              }
            }}
          >
            Add new choice
          </button>
          <button
            onClick={() => {
              console.log(numberOfChoices);
              if (numberOfChoices >= 2) {
                removeChoice(numberOfChoices);
                setNumberOfChoices((curr) => curr - 1);
              }
            }}
          >
            Remove last choice
          </button>
          {choices.map((choice, idx) => {
            return (
              <TextField
                id={`choice-${idx + 1}`}
                label={`Choice ${idx + 1}`}
                value={choice.text}
                sx={{ width: 250 }}
                onChange={(e) => {
                  handleChoiceChange(e, idx);
                }}
              />
            );
          })}
          <button type="submit">Create</button>
        </Stack>
      </form>
    </div>
  );
};
