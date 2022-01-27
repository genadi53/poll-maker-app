import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import Countdown, { zeroPad } from "react-countdown";

interface PoolProps {
  question: string;
  choices: {
    __typename?: "Choice";
    id: number;
    text: string;
  }[];
  expirationDateTime: string;
  creator: {
    email: string;
    username: string;
  };
}

export const Pool: React.FC<PoolProps> = ({
  question,
  choices,
  expirationDateTime,
  creator,
}) => {
  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {question}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            created by {creator.username}
          </Typography>
          {choices.map((choice) => (
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Button>+</Button>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">{choice.text}</Typography>
              </Grid>
            </Grid>
          ))}
        </CardContent>
        <CardActions>
          <Countdown
            date={new Date(parseInt(expirationDateTime)).toISOString()}
            renderer={({ days, hours, minutes, seconds }) => (
              <span suppressHydrationWarning={true}>
                {days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? (
                  <>
                    Expired on{" "}
                    {new Date(parseInt(expirationDateTime)).toDateString()}
                  </>
                ) : (
                  <>
                    Time left {zeroPad(days)}:{zeroPad(hours)}:
                    {zeroPad(minutes)}:{zeroPad(seconds)}
                  </>
                )}
              </span>
            )}
          />
          {/* <>Date {JSON.stringify(date)}</> */}
        </CardActions>
      </Card>
    </div>
  );
};
